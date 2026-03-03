import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { AdminService } from '../../core/services/admin.service';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PlatformSettingsDialog } from '../admin-layout/platform-settings-dialog';
import { SocketService } from '../../core/services/socket.service';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatTabsModule,
    MatRippleModule,
    MatMenuModule,
    RouterLink
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  stats: any[] = [];
  isLoading = true;
  currentPeriod: 'weekly' | 'monthly' = 'weekly';
  private socketSubscription?: Subscription;

  performanceData: number[] = [];
  performanceLabels: string[] = [];
  categoriesData: any[] = [];

  mallSettings = {
    title: 'Plateforme Mall Management',
    bannerUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000'
  };

  constructor(
    private adminService: AdminService,
    private socketService: SocketService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMallSettings();
      this.loadDashboardData();
      this.setupRealtimeSync();
    }
  }

  ngOnDestroy() {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  setupRealtimeSync() {
    this.socketSubscription = this.socketService.onDataChanged().subscribe(update => {
      console.log('Dashboard: Realtime update received:', update);
      // Refresh dashboard data when any relevant collection changes
      this.loadDashboardData(this.currentPeriod);
    });
  }

  loadMallSettings() {
    const savedTitle = localStorage.getItem('mall_title');
    const savedBanner = localStorage.getItem('mall_banner');
    if (savedTitle) this.mallSettings.title = savedTitle;
    if (savedBanner) this.mallSettings.bannerUrl = savedBanner;
  }

  loadDashboardData(period: 'weekly' | 'monthly' = 'weekly') {
    this.currentPeriod = period;
    this.isLoading = true;
    this.adminService.getDashboardStats(period).subscribe({
      next: (res) => {
        if (res && res.stats) {
          this.stats = res.stats.map((s: any) => ({
            title: s.title,
            value: s.value.toString(),
            icon: s.icon,
            color: this.getColorForIcon(s.icon)
          }));
        }

        // Map Performance Data
        if (res.performance) {
          this.performanceData = res.performance.map((p: any) => p.count);
          this.performanceLabels = res.performance.map((p: any) => p._id.split('-').slice(1).reverse().join('/'));
        }

        // Map Category Distribution
        if (res.categoriesDist) {
          const total = res.categoriesDist.reduce((acc: number, curr: any) => acc + curr.value, 0);
          const colors = ['#0ca678', '#4dabf7', '#ff922b', '#845ef7', '#1098ad', '#ae3ec9'];
          this.categoriesData = res.categoriesDist.map((c: any, i: number) => ({
            label: c.label,
            value: Math.round((c.value / total) * 100),
            color: colors[i % colors.length]
          }));
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard stats', err);
        this.isLoading = false;
      }
    });
  }

  openSettings() {
    const dialogRef = this.dialog.open(PlatformSettingsDialog, {
      panelClass: ['large-dialog', 'premium-dialog-surface'],
      data: {
        title: this.mallSettings.title,
        bannerUrl: this.mallSettings.bannerUrl
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mallSettings.title = result.title;
        this.mallSettings.bannerUrl = result.bannerUrl;
        localStorage.setItem('mall_title', result.title);
        localStorage.setItem('mall_banner', result.bannerUrl);
        // Page reload or event emitter might be needed to sync with sidebar, 
        // but for now local update is fine.
        window.location.reload();
      }
    });
  }

  getColorForIcon(icon: string): string {
    const colors: { [key: string]: string } = {
      'storefront': '#4f46e5',
      'people': '#8b5cf6',
      'person_add': '#10b981',
      'pending_actions': '#f59e0b'
    };
    return colors[icon] || '#607d8b';
  }

  exportPDF() {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(12, 166, 120); // Primary green
    doc.text('Rapport Mall Platform', 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Date d'exportation : ${new Date().toLocaleDateString()}`, 14, 30);

    // Stats summary
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text('Aperçu des performances', 14, 45);

    const tableData = this.stats.map(s => [s.title, s.value]);

    autoTable(doc, {
      startY: 50,
      head: [['Indicateur', 'Valeur (Actuelle)']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [12, 166, 120] },
      margin: { left: 14 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Répartition des boutiques', 14, finalY);

    const categoryData = this.categoriesData.map(c => [c.label, c.value + '%']);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Catégorie', 'Proportion']],
      body: categoryData,
      theme: 'grid',
      headStyles: { fillColor: [16, 152, 173] }, // Secondary blue
      margin: { left: 14 }
    });

    doc.save('rapport-mall-platform.pdf');
  }
}
