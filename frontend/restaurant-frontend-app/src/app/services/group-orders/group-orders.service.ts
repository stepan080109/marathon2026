import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { GroupSessionsResponse } from '@app/models/group-orders/group-sessions-response.model';
import { GroupStatusResponse } from '@app/models/group-orders/group-status.model';
import { OwnerSessionResponse } from '@app/models/group-orders/owner-session.model';
import {
  SubmitGroupPreOrderRequest,
  SubmittedDish,
} from '@app/models/group-orders/submit-group-pre-order.model';
import { GroupInviteToken, GuestInvite } from '@app/models/reservations/guest-invite.model';
import { API_BASE_URL } from '@app/shared/config/api-base-url.token';

@Injectable({
  providedIn: 'root',
})
export class GroupOrdersService {
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly http = inject(HttpClient);

  getGroupInvite$(reservationId: string): Observable<GuestInvite> {
    const encodedId = encodeURIComponent(reservationId);
    return this.http
      .get<GroupInviteToken>(`${this.baseUrl}/reservations/${encodedId}/invite-token`)
      .pipe(
        switchMap((tokenRes) =>
          this.http.get<GuestInvite>(
            `${this.baseUrl}/guest/invites/${encodeURIComponent(tokenRes.token)}`,
          ),
        ),
      );
  }

  getSessions$(groupReservationId: string): Observable<GroupSessionsResponse> {
    const encodedGroupId = encodeURIComponent(groupReservationId);
    return this.http.get<GroupSessionsResponse>(
      `${this.baseUrl}/guest/groups/${encodedGroupId}/sessions`,
    );
  }

  getOwnerSessionId$(reservationId: string): Observable<string> {
    const encodedId = encodeURIComponent(reservationId);
    return this.http
      .get<OwnerSessionResponse>(`${this.baseUrl}/reservations/${encodedId}/guest-session-id`)
      .pipe(map((res) => res.guestSessionId));
  }

  getStatus$(groupReservationId: string): Observable<GroupStatusResponse> {
    const encodedGroupId = encodeURIComponent(groupReservationId);
    return this.http.get<GroupStatusResponse>(
      `${this.baseUrl}/guest/groups/${encodedGroupId}/status`,
    );
  }

  submit$(groupReservationId: string, reservationId: string): Observable<SubmittedDish[]> {
    const encodedGroupId = encodeURIComponent(groupReservationId);
    const body: SubmitGroupPreOrderRequest = { reservationId };
    return this.http.post<SubmittedDish[]>(
      `${this.baseUrl}/group-reservations/${encodedGroupId}/submit`,
      body,
    );
  }
}
