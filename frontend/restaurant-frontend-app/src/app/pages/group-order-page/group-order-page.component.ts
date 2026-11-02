import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { ParticipantCardComponent } from '@app/components/group-orders/participant-card/participant-card.component';
import { GroupReservationStatus } from '@app/models/group-orders/group-status.model';
import { Participant } from '@app/models/group-orders/participant.model';
import { GuestInvite } from '@app/models/reservations/guest-invite.model';
import { GroupOrdersService } from '@app/services/group-orders/group-orders.service';
import { ToastService } from '@app/services/toast/toast.service';
import { ModalComponent } from '@app/shared/custom-components/modal/modal.component';
import { consolidatePreOrder } from '@app/shared/helpers/consolidate-pre-order';

@Component({
  selector: 'app-group-order-page',
  imports: [CurrencyPipe, DatePipe, ParticipantCardComponent, ModalComponent],
  templateUrl: './group-order-page.component.html',
  styleUrl: './group-order-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class GroupOrderPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly groupOrdersService = inject(GroupOrdersService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly reservationId = this.route.snapshot.paramMap.get('reservationId') ?? '';

  readonly invite = signal<GuestInvite | null>(null);
  readonly participants = signal<Participant[]>([]);
  readonly ownerSessionId = signal<string>('');
  readonly status = signal<GroupReservationStatus>('Open');
  readonly loading = signal<boolean>(true);
  readonly errorStatus = signal<number | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly showConfirmModal = signal<boolean>(false);

  readonly consolidated = computed(() => consolidatePreOrder(this.participants()));
  readonly grandTotal = computed(() => this.consolidated().total);

  readonly unsubmittedCount = computed(
    () => this.participants().filter((person) => !person.isSubmitted).length,
  );

  readonly hasAnyDishes = computed(() =>
    this.participants().some((person) => person.items.length > 0),
  );

  readonly canSubmit = computed(
    () =>
      this.status() === 'Open' &&
      this.consolidated().items.length > 0 &&
      !this.isSubmitting(),
  );

  readonly statusLabel = computed(() => {
    switch (this.status()) {
      case 'Submitted':
        return 'Sent to Restaurant';
      case 'Closed':
        return 'Closed';
      default:
        return 'Collecting pre-orders';
    }
  });

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.errorStatus.set(null);

    this.groupOrdersService
      .getGroupInvite$(this.reservationId)
      .pipe(
        switchMap((inviteData) =>
          forkJoin({
            invite: of(inviteData),
            sessions: this.groupOrdersService.getSessions$(inviteData.GroupReservationId),
            ownerId: this.groupOrdersService.getOwnerSessionId$(this.reservationId),
            groupStatus: this.groupOrdersService.getStatus$(inviteData.GroupReservationId),
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.invite.set(result.invite);
          this.participants.set(result.sessions.participants);
          this.ownerSessionId.set(result.ownerId);
          this.status.set(result.groupStatus.status);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          const code = err instanceof HttpErrorResponse ? err.status : 500;
          this.errorStatus.set(code || 500);
          this.loading.set(false);
        },
      });
  }

  openConfirmModal(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.showConfirmModal.set(true);
  }

  closeConfirmModal(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.showConfirmModal.set(false);
  }

  confirmSubmit(): void {
    const currentInvite = this.invite();
    if (this.isSubmitting() || !currentInvite) {
      return;
    }

    this.isSubmitting.set(true);

    this.groupOrdersService
      .submit$(currentInvite.GroupReservationId, this.reservationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.showConfirmModal.set(false);
          this.status.set('Submitted');
          this.toast.success('Pre-order sent to the restaurant');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.showConfirmModal.set(false);
        },
      });
  }
}
