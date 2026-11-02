using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using APIHandler.Exceptions;
using APIHandler.Helpers;
using APIHandler.Models.GroupReservation;
using APIHandler.Services.GroupReservations;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace APIHandler.Handlers.GroupReservations;

public class SubmitGroupPreOrderHandler(IGroupReservationService groupReservationService) : IApiRequestHandler
{
    private readonly IGroupReservationService _groupReservationService = groupReservationService ?? throw new ArgumentNullException(nameof(groupReservationService));

    public async Task<APIGatewayProxyResponse> HandleRequest(APIGatewayProxyRequest request, ILambdaContext context)
    {
        if (!request.TryGetPathValue("groupReservationId", out var groupReservationId))
        {
            return ResponseBuilder.CreateErrorResponse(400, "Missing 'groupReservationId' in path parameters.", context.Logger);
        }

        if (request.RequestContext?.Authorizer?.Claims == null ||
            !request.RequestContext.Authorizer.Claims.TryGetValue("sub", out var userId) ||
            string.IsNullOrWhiteSpace(userId))
        {
            return ResponseBuilder.CreateErrorResponse(401, "Unauthorized.", context.Logger);
        }

        if (!TryDeserializeRequest(request.Body, out var submitRequest) || string.IsNullOrWhiteSpace(submitRequest?.ReservationId))
        {
            return ResponseBuilder.CreateErrorResponse(400, "Invalid request body. 'reservationId' is required.", context.Logger);
        }

        try
        {
            var result = await _groupReservationService.SubmitGroupPreOrderAsync(userId, groupReservationId, submitRequest.ReservationId);
            return ResponseBuilder.CreateJsonResponse(200, result);
        }
        catch (ReservationNotFoundException ex)
        {
            return ResponseBuilder.CreateErrorResponse(404, ex.Message, context.Logger);
        }
        catch (GroupReservationNotFoundException ex)
        {
            return ResponseBuilder.CreateErrorResponse(404, ex.Message, context.Logger);
        }
        catch (ActionForbiddenException ex)
        {
            return ResponseBuilder.CreateErrorResponse(403, ex.Message, context.Logger);
        }
        catch (ValidationException ex)
        {
            return ResponseBuilder.CreateErrorCodeResponse(ex);
        }
    }

    private static bool TryDeserializeRequest(string? body, out SubmitGroupPreOrderRequest? submitRequest)
    {
        if (string.IsNullOrWhiteSpace(body))
        {
            submitRequest = null;
            return false;
        }

        try
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            submitRequest = JsonSerializer.Deserialize<SubmitGroupPreOrderRequest>(body, options);
            return submitRequest != null;
        }
        catch (JsonException)
        {
            submitRequest = null;
            return false;
        }
    }
}
