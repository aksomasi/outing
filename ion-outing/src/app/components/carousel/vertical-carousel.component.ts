import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-vertical-carousel',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle],
  templateUrl: './vertical-carousel.component.html',
  styleUrls: ['./vertical-carousel.component.scss']
})
export class VerticalCarouselComponent implements AfterViewInit, OnDestroy {
  /** Photos to render */
  @Input() images: string[] = [];

  /** How many are visible at once (e.g., 3, 3.5, 4) */
  @Input() slidesPerView = 6;

  /** Auto-play interval ms (set 0 to disable) */
  @Input() autoplayMs = 2500;

  /** Animation speed */
  @Input() transitionMs = 550;

  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLDivElement>;

  // internal state
  current = signal(0);
  private timer?: any;

  // For seamless looping, clone head & tail
  get looped(): string[] {
    if (!this.images?.length) return [];
    const n = Math.ceil(this.slidesPerView);
    const head = this.images.slice(0, n);
    const tail = this.images.slice(-n);
    return [...tail, ...this.images, ...head];
  }

  // real slides offset (because of tail clones)
  get baseOffset(): number {
    return Math.ceil(this.slidesPerView);
  }

  ngAfterViewInit(): void {
    this.applyCssVars();
    // start from first real slide
    this.current.set(this.baseOffset);
    this.startAutoplay();
    window.addEventListener('resize', this.applyCssVars);
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    window.removeEventListener('resize', this.applyCssVars);
  }

  private applyCssVars = () => {
    const el = this.trackRef.nativeElement as HTMLElement;
    el.style.setProperty('--spv', String(this.slidesPerView));
    el.style.setProperty('--transition-ms', `${this.transitionMs}ms`);
  };

  next() {
    this.jump(this.current() + 1);
  }
  prev() {
    this.jump(this.current() - 1);
  }

  private jump(to: number) {
    const el = this.trackRef.nativeElement;
    el.classList.add('moving');
    this.current.set(to);

    // after transition, fix index if we crossed loop boundaries (no flash)
    window.clearTimeout((el as any)._snapFix);
    (el as any)._snapFix = window.setTimeout(() => {
      const n = this.images.length;
      const clones = this.baseOffset;
      let idx = this.current();

      if (idx >= n + clones) {
        // passed end → snap back inside without animation
        el.classList.remove('moving');
        idx = idx - n;
        this.current.set(idx);
      } else if (idx < clones) {
        // passed start → snap forward inside without animation
        el.classList.remove('moving');
        idx = idx + n;
        this.current.set(idx);
      }
      // re-enable movement on next frame
      requestAnimationFrame(() => el.classList.add('moving'));
    }, this.transitionMs + 20);
  }

  startAutoplay() {
    if (!this.autoplayMs) return;
    this.stopAutoplay();
    this.timer = setInterval(() => this.next(), this.autoplayMs);
  }
  stopAutoplay() {
    if (this.timer) clearInterval(this.timer);
  }

  // Basic touch drag (vertical)
  private startY = 0;
  private deltaY = 0;
  onPointerDown(e: PointerEvent) {
    this.stopAutoplay();
    this.startY = e.clientY;
    this.deltaY = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
    this.trackRef.nativeElement.classList.remove('moving');
  }
  onPointerMove(e: PointerEvent) {
    if (!this.startY) return;
    this.deltaY = e.clientY - this.startY;
    // translate by pixel delta (handled in CSS variable)
    this.trackRef.nativeElement.style.setProperty('--dragY', `${this.deltaY}px`);
  }
  onPointerUp(e: PointerEvent) {
    if (!this.startY) return;
    const threshold = 40; // px to trigger slide
    this.trackRef.nativeElement.classList.add('moving');
    this.trackRef.nativeElement.style.removeProperty('--dragY');
    if (this.deltaY < -threshold) this.next();
    else if (this.deltaY > threshold) this.prev();
    this.startY = 0;
    this.deltaY = 0;
    this.startAutoplay();
  }

  
}
