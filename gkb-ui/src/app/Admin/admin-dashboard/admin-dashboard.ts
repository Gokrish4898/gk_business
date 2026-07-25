import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MetricPoint {
  date: string;
  count: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit, OnDestroy {
  activeTab: 'analytics' | 'masters' = 'analytics';

  // Private ElementRef storage
  private _ordersCanvas: ElementRef<HTMLCanvasElement> | null = null;
  private _visitorsCanvas: ElementRef<HTMLCanvasElement> | null = null;

  // Chart instances
  ordersChart: Chart | null = null;
  visitorsChart: Chart | null = null;

  // Setters to hook dynamic DOM mounting inside @if blocks
  @ViewChild('ordersCanvas') set ordersCanvasRef(ref: ElementRef<HTMLCanvasElement> | undefined) {
    if (ref) {
      this._ordersCanvas = ref;
      setTimeout(() => this.createOrdersChart(), 0);
    } else {
      this._ordersCanvas = null;
      this.destroyOrdersChart();
    }
  }

  @ViewChild('visitorsCanvas') set visitorsCanvasRef(ref: ElementRef<HTMLCanvasElement> | undefined) {
    if (ref) {
      this._visitorsCanvas = ref;
      setTimeout(() => this.createVisitorsChart(), 0);
    } else {
      this._visitorsCanvas = null;
      this.destroyVisitorsChart();
    }
  }

  // Mock Database Arrays
  ordersData: MetricPoint[] = [
    { date: 'Jul 19', count: 14 },
    { date: 'Jul 20', count: 28 },
    { date: 'Jul 21', count: 18 },
    { date: 'Jul 22', count: 32 },
    { date: 'Jul 23', count: 45 },
    { date: 'Jul 24', count: 38 },
    { date: 'Jul 25', count: 58 }
  ];

  visitorsData: MetricPoint[] = [
    { date: 'Jul 19', count: 110 },
    { date: 'Jul 20', count: 165 },
    { date: 'Jul 21', count: 145 },
    { date: 'Jul 22', count: 240 },
    { date: 'Jul 23', count: 295 },
    { date: 'Jul 24', count: 220 },
    { date: 'Jul 25', count: 380 }
  ];

  panels = [
    {
      title: 'Products Master',
      desc: 'Manage baking catalog, pricing, and stock status',
      icon: 'bi bi-cake2-fill',
      route: '/admin/products',
      color: '#e67e22',
      disabled: false
    },
    {
      title: 'Recipe Master',
      desc: 'Formulate ingredients list, quantities, and measure units',
      icon: 'bi bi-journal-text',
      route: '/admin/recipes',
      color: '#d4a373',
      disabled: false
    },
    {
      title: 'Inventory & Stock',
      desc: 'Control raw material stock levels and pricing',
      icon: 'bi bi-box-seam-fill',
      route: '/admin',
      color: '#7f8c8d',
      disabled: true
    },
    {
      title: 'Extra Toppings',
      desc: 'Configure premium topping additions and pricing',
      icon: 'bi bi-sparkles',
      route: '/admin',
      color: '#7f8c8d',
      disabled: true
    }
  ];

  ngOnInit() {
    // Keep standard hook signatures
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  selectTab(tab: 'analytics' | 'masters') {
    this.activeTab = tab;
  }

  // --- CHART BUILD LOGIC ---
  createOrdersChart() {
    this.destroyOrdersChart();
    if (!this._ordersCanvas) return;

    const ctx = this._ordersCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.ordersChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.ordersData.map(d => d.date),
        datasets: [{
          label: 'Orders',
          data: this.ordersData.map(d => d.count),
          borderColor: '#e67e22',
          backgroundColor: 'rgba(230, 126, 34, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#e67e22',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1c1c1e',
            titleFont: { family: 'Lato', size: 12 },
            bodyFont: { family: 'Lato', size: 12, weight: 'bold' },
            padding: 10,
            cornerRadius: 6,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Lato', size: 10 }, color: '#8a9ba8' }
          },
          y: {
            grid: { color: '#f1f2f6' },
            ticks: { font: { family: 'Lato', size: 10 }, color: '#8a9ba8' }
          }
        }
      }
    });
  }

  createVisitorsChart() {
    this.destroyVisitorsChart();
    if (!this._visitorsCanvas) return;

    const ctx = this._visitorsCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.visitorsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.visitorsData.map(d => d.date),
        datasets: [{
          label: 'Visitors',
          data: this.visitorsData.map(d => d.count),
          backgroundColor: '#d4a373',
          hoverBackgroundColor: '#c59262',
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1c1c1e',
            titleFont: { family: 'Lato', size: 12 },
            bodyFont: { family: 'Lato', size: 12, weight: 'bold' },
            padding: 10,
            cornerRadius: 6,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Lato', size: 10 }, color: '#8a9ba8' }
          },
          y: {
            grid: { color: '#f1f2f6' },
            ticks: { font: { family: 'Lato', size: 10 }, color: '#8a9ba8' }
          }
        }
      }
    });
  }

  destroyOrdersChart() {
    if (this.ordersChart) {
      this.ordersChart.destroy();
      this.ordersChart = null;
    }
  }

  destroyVisitorsChart() {
    if (this.visitorsChart) {
      this.visitorsChart.destroy();
      this.visitorsChart = null;
    }
  }

  destroyCharts() {
    this.destroyOrdersChart();
    this.destroyVisitorsChart();
  }

  // KPI Calculations
  getTotalOrders(): number {
    return this.ordersData.reduce((sum, item) => sum + item.count, 0);
  }

  getTotalVisitors(): number {
    return this.visitorsData.reduce((sum, item) => sum + item.count, 0);
  }

  getAverageOrders(): number {
    return Math.round(this.getTotalOrders() / this.ordersData.length);
  }
}
