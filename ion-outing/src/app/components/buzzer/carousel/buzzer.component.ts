import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-buzzer',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle],
  templateUrl: './buzzer.component.html',
  styleUrls: ['./buzzer.component.scss']
})
export class BuzzerComponent implements AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  
}
