import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function TrafficChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // Load Chart.js from CDN if not already loaded
    if (window.Chart) {
      initChart();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        initChart();
      };
      document.head.appendChild(script);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const initChart = () => {
    if (!chartRef.current || !window.Chart) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Organic Traffic',
          data: [3200, 2800, 3600, 4100, 3800, 2400, 2100],
          backgroundColor: 'hsl(120, 61%, 50%)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">Organic Traffic</CardTitle>
            <p className="text-sm text-gray-600">Visitors from search engines</p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-primary text-white">7D</Button>
            <Button size="sm" variant="outline">30D</Button>
            <Button size="sm" variant="outline">90D</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
