import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { colorHelper } from '../utils/color-sets';
import { BaseChartComponent } from '../common/base-chart.component';

@Component({
  selector: 'pie-chart',
  template: `
    <chart
      [colors]="colors"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)"
      [legend]="legend"
      [view]="[width, height]"
      [legendData]="domain">
      <svg:g [attr.transform]="translation" class="pie-chart chart">
        <svg:g pieSeries
          [colors]="colors"
          [showLabels]="labels"
          [series]="data"
          [activeEntries]="activeEntries"
          [innerRadius]="innerRadius"
          [outerRadius]="outerRadius"
          [explodeSlices]="explodeSlices"
          [gradient]="gradient"
          (select)="onClick($event)"
        />
      </svg:g>
    </chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent extends BaseChartComponent {

  @Input() labels = false;
  @Input() legend = false;
  @Input() explodeSlices = false;
  @Input() doughnut = false;
  @Input() gradient: boolean;
  @Input() activeEntries: any[] = [];

  @Output() select = new EventEmitter();
  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  translation: string;
  outerRadius: number;
  innerRadius: number;
  data: any;
  colors: Function;
  domain: any;
  dims: any;
  margin = [20, 20, 20, 20];

  update(): void {
    super.update();

    this.zone.run(() => {
      if (this.labels) {
        this.margin = [30, 80, 30, 80];
      }

      this.dims = calculateViewDimensions({
        width: this.width,
        height: this.height,
        margins: this.margin,
        showLegend: this.legend,
        columns: 10
      });

      let xOffset = this.margin[3] + this.dims.width / 2;
      let yOffset = this.margin[0] + this.dims.height / 2;
      this.translation = `translate(${xOffset}, ${yOffset})`;
      this.outerRadius = Math.min(this.dims.width, this.dims.height);
      if (this.labels) {
        // make room for labels
        this.outerRadius /= 3;
      } else {
        this.outerRadius /= 2;
      }
      this.innerRadius = 0;
      if (this.doughnut) {
        this.innerRadius = this.outerRadius * 0.75;
      }

      this.domain = this.getDomain();

      // sort data according to domain
      this.data = this.results.sort((a, b) => {
        return this.domain.indexOf(a.name) - this.domain.indexOf(b.name);
      });

      this.setColors();
    });
  }

  getDomain(): any[] {
    let items = [];

    this.results.map(d => {
      let label = d.name;
      if (label.constructor.name === 'Date') {
        label = label.toLocaleDateString();
      } else {
        label = label.toLocaleString();
      }

      if (items.indexOf(label) === -1) {
        items.push(label);
      }
    });

    return items;
  }

  onClick(data): void {
    this.select.emit(data);
  }

  setColors(): void {
    this.colors = colorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
  }

  onActivate(event): void {
    if(this.activeEntries.indexOf(event) > -1) return;
    this.activeEntries = [ event, ...this.activeEntries ];
    this.activate.emit({ value: event, entries: this.activeEntries });
  }

  onDeactivate(event): void {
    const idx = this.activeEntries.indexOf(event);

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: event, entries: this.activeEntries });
  }

}
