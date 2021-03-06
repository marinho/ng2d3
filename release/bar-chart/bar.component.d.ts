import { EventEmitter, ElementRef, SimpleChanges, OnInit, OnChanges } from '@angular/core';
export declare class BarComponent implements OnInit, OnChanges {
    fill: any;
    data: any;
    width: any;
    height: any;
    x: any;
    y: any;
    orientation: any;
    roundEdges: boolean;
    gradient: boolean;
    offset: number;
    isActive: boolean;
    select: EventEmitter<{}>;
    element: any;
    path: any;
    gradientId: any;
    gradientFill: any;
    startOpacity: any;
    initialized: boolean;
    constructor(element: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    update(): void;
    loadAnimation(): void;
    animateToCurrentForm(): void;
    getStartingPath(): any;
    getPath(): any;
    getRadius(): number;
    getStartOpacity(): number;
    roundedRect(x: any, y: any, w: any, h: any, r: any, tl: any, tr: any, bl: any, br: any): any;
}
