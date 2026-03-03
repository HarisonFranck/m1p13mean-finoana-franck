import { Injectable } from '@angular/core';

export interface ShopStatus {
    label: string; // 'Ouvert', 'Fermé', 'Ferme bientôt', 'Congé'
    class: string; // 'open', 'closed', 'closing-soon', 'vacation'
    nextChange?: string; // e.g., 'Ferme à 20:00'
}

@Injectable({
    providedIn: 'root'
})
export class ShopStatusService {
    private daysMap: { [key: number]: string } = {
        1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 0: 'Dimanche'
    };

    calculateStatus(shop: any): ShopStatus {
        if (!shop) return { label: 'Inconnu', class: 'closed' };

        const now = new Date();

        // 1. Check Closing Schedules (Annual leave, etc.)
        if (shop.closingSchedules && shop.closingSchedules.length > 0) {
            for (const schedule of shop.closingSchedules) {
                const start = new Date(schedule.startDate);
                const end = new Date(schedule.endDate);
                if (now >= start && now <= end) {
                    return { label: 'En congé', class: 'vacation' };
                }
            }
        }

        // 2. Check Opening Hours
        const currentDayName = this.daysMap[now.getDay()];
        const todayHours = shop.openingHours?.find((h: any) => h.day === currentDayName);

        if (!todayHours || todayHours.isClosed || !todayHours.open || !todayHours.close) {
            return { label: 'Fermé', class: 'closed' };
        }

        const [openH, openM] = todayHours.open.split(':').map(Number);
        const [closeH, closeM] = todayHours.close.split(':').map(Number);

        const openTime = new Date(now);
        openTime.setHours(openH, openM, 0);

        const closeTime = new Date(now);
        closeTime.setHours(closeH, closeM, 0);

        if (now < openTime) {
            return { label: 'Fermé', class: 'closed', nextChange: `Ouvre à ${todayHours.open}` };
        }

        if (now > closeTime) {
            return { label: 'Fermé', class: 'closed' };
        }

        // Check if closing soon (within 60 minutes)
        const diffMs = closeTime.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins <= 60 && diffMins > 0) {
            return { label: 'Ferme bientôt', class: 'closing-soon', nextChange: `Ferme à ${todayHours.close}` };
        }

        return { label: 'Ouvert', class: 'open', nextChange: `Ferme à ${todayHours.close}` };
    }
}
