import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { PlatformSettingsDialog } from './platform-settings-dialog';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {
  isSidenavOpen = true;
  searchQuery = '';
  searchResults: any[] = [];
  notifications: any[] = [];

  // Data for the "Upstream" style Hero Section
  currentContext = {
    title: 'Plateforme Mall Management',
    status: 'Opérationnel',
    location: 'Antananarivo, Madagascar',
    id: 'MALL-2026-X1',
    bannerUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000'
  };

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.loadSettings();
    this.fetchNotifications();
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  fetchNotifications() {
    this.adminService.getNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.adminService.globalSearch(this.searchQuery).subscribe(results => {
      this.searchResults = results;
    });
  }

  navigateToResult(result: any) {
    this.clearSearch();
    this.router.navigate([result.link]);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
  }

  markAsRead(id: string) {
    this.adminService.markNotificationRead(id).subscribe(() => {
      const notification = this.notifications.find(n => n._id === id);
      if (notification) notification.read = true;
    });
  }

  markAllAsRead() {
    this.adminService.markAllNotificationsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
    });
  }

  deleteNotification(event: Event, id: string) {
    event.stopPropagation();
    this.adminService.deleteNotification(id).subscribe(() => {
      this.notifications = this.notifications.filter(n => n._id !== id);
    });
  }

  loadSettings() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTitle = localStorage.getItem('mall_title');
      const savedBanner = localStorage.getItem('mall_banner');

      if (savedTitle) this.currentContext.title = savedTitle;
      if (savedBanner) this.currentContext.bannerUrl = savedBanner;
    }
  }

  openSettingsDialog() {
    const dialogRef = this.dialog.open(PlatformSettingsDialog, {
      panelClass: ['large-dialog', 'premium-dialog-surface'],
      data: {
        title: this.currentContext.title,
        bannerUrl: this.currentContext.bannerUrl
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.currentContext.title = result.title;
        this.currentContext.bannerUrl = result.bannerUrl;

        // Save to localStorage only if in browser
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('mall_title', result.title);
          localStorage.setItem('mall_banner', result.bannerUrl);
        }
      }
    });
  }

  breadcrumbs = [
    { label: 'Admin', link: '/admin' },
    { label: 'Dashboard', link: '/admin/dashboard' }
  ];

  tabs = [
    { label: 'Aperçu', link: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Boutiques', link: '/admin/shops', icon: 'storefront' },
    { label: 'Catégories', link: '/admin/categories', icon: 'category' },
    { label: 'Utilisateurs', link: '/admin/users', icon: 'people' },
    { label: 'Événements', link: '/admin/events', icon: 'calendar_today' },
    { label: 'Documents', link: '/admin/content', icon: 'description' }
  ];

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
