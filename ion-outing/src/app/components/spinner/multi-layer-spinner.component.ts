// Angular Standalone Component: Multi‑Layer Shuffle Spinner (Infor ION)
// Drop this file as: src/app/multi-layer-spinner.component.ts
// Usage (standalone app): import in AppComponent and render <app-multi-layer-spinner ... />
// If you're on NgModule style, see the note at the end for a module-friendly wrapper.

import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-layer-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="wrap">
    <p class="waiting-msg" *ngIf="showWaiting">
      ⏳ Please wait for other players to add their names...<br>
      Soon we can start shuffling the teams!
    </p>

    <div class="wheel" [style.--size.px]="size">
      <div class="pointer"></div>

      <!-- OUTER RING -->
      <ul #ring1 class="ring ring--1" [class.spinning]="isSpinning">
        <li *ngFor="let n of outerNames; let i = index"
            [style.transform]="itemTransform(i, outerNames.length, r1)">{{ n }}</li>
      </ul>

      <!-- MIDDLE RING -->
      <ul #ring2 class="ring ring--2" [class.spinning]="isSpinning">
        <li *ngFor="let n of middleNames; let i = index"
            [style.transform]="itemTransform(i, middleNames.length, r2)">{{ n }}</li>
      </ul>

      <!-- INNER RING -->
      <ul #ring3 class="ring ring--3" [class.spinning]="isSpinning">
        <li *ngFor="let n of innerNames; let i = index"
            [style.transform]="itemTransform(i, innerNames.length, r3)">{{ n }}</li>
      </ul>

      <!-- Center hub brand -->
      <div class="hub">
        <div class="brand">INFOR</div>
        <div class="sub">ION</div>
      </div>
    </div>

    <div class="actions">
      <button type="button" (click)="spin()">Spin & Pick (1 of {{ totalCount }})</button>
      <span class="hint" *ngIf="lastWinner">Winner: <b>{{ lastWinner.name }}</b> <i>({{ lastWinner.layerLabel }})</i></span>
    </div>
  </div>
  `,
  styles: [`
  :host{ --ion-red:#DA291C; --ion-white:#ffffff; --ion-ink:#101114; --bg:#0b0d12; --text:#f5f7ff }
  *{ box-sizing:border-box }
  .wrap{ display:grid; place-items:center; gap:12px; color:var(--text); padding:16px; min-height:100vh; background:var(--bg) }

  .waiting-msg{ text-align:center; font-size:14px; background:#ffffff12; padding:8px 12px; border-radius:10px; border:1px solid #ffffff24 }

  .wheel{ width:var(--size); aspect-ratio:1; position:relative; border-radius:50%; display:grid; place-items:center; background: radial-gradient(circle at 50% 50%, #0f1320 0 54%, transparent 54% 100%); outline:2px solid #ffffff1a; outline-offset:6px; box-shadow: inset 0 0 0 1px #ffffff1a, 0 22px 60px #0000009a }
  .pointer{ position:absolute; top:-18px; left:50%; transform:translateX(-50%); width:0; height:0; border:12px solid transparent; border-bottom-color: var(--ion-red); filter: drop-shadow(0 6px 6px #000000a0) }

  .ring{ position:absolute; inset:0; display:grid; place-items:center; border-radius:50%; animation: idle 36s linear infinite }
  .ring--2{ animation-duration: 30s }
  .ring--3{ animation-duration: 24s }
  @keyframes idle{ from{ transform: rotate(0turn) } to{ transform: rotate(1turn) } }

  .ring li{ list-style:none; position:absolute; left:50%; top:50%; transform: translate(-50%, -50%); padding:.42rem .6rem; border-radius:999px; background:#ffffff12; backdrop-filter: blur(4px); box-shadow: 0 0 0 1px #ffffff24, 0 6px 16px #00000066; color:var(--ion-white); white-space:nowrap; font-weight:700; letter-spacing:.15px; font-size:12px }

  /* while spinning to a stop, pause CSS animation and let TS drive transforms */
  .ring.spinning{ animation: none; transition: transform 4.6s cubic-bezier(.08,.77,.2,1) }

  .hub{ position:absolute; width:120px; aspect-ratio:1; border-radius:50%; display:grid; place-items:center; background: radial-gradient(circle at 35% 35%, #ffffffe6, #ffffff55 58%, #ffffff15 61%, #ffffff00 62%), conic-gradient(from 0turn, #ffffff18, #ffffff08 60%, #ffffff18); box-shadow: inset 0 0 0 1px #ffffff50, 0 14px 34px #0000009a }
  .brand{ font-weight:900; font-size:18px; color:var(--ion-ink) }
  .sub{ margin-top:2px; font-weight:800; font-size:14px; color:var(--ion-red) }

  .actions{ display:flex; gap:12px; align-items:center; justify-content:center }
  button{ appearance:none; border:0; padding:.8rem 1.1rem; border-radius:999px; cursor:pointer; font-weight:800; color:var(--ion-white); background: linear-gradient(135deg, var(--ion-red), #9b0f07); box-shadow: 0 12px 24px #0000009a, inset 0 0 0 1px #ffffff40 }
  button:active{ transform: translateY(1px) }
  .hint{ font-size:13px; opacity:.85 }
  `]
})
export class MultiLayerSpinnerComponent {
  // Config
  @Input() size = 520; // px
  @Input() r1 = 200;   // outer radius
  @Input() r2 = 150;   // middle radius
  @Input() r3 = 110;   // inner radius
  @Input() showWaiting = true; // shows the waiting message until you hide it

  // Data (15 names per ring)
  @Input() outerNames: string[] = [
    'Anil','Bhavna','Chitra','Deepak','Esha','Farhan','Gita','Harish','Indu','Jai','Kiran','Lata','Mahesh','Nisha','Omkar'
  ];
  @Input() middleNames: string[] = [
    'Pooja','Qadir','Rhea','Sanjay','Tanvi','Uday','Vaishali','Wasim','Xenia','Yash','Zara','Aarav','Bindi','Charan','Divya'
  ];
  @Input() innerNames: string[] = [
    'Eshan','Falguni','Gopal','Hemant','Ipsita','Jatin','Kavya','Laksh','Maya','Neeraj','Ovi','Pranav','Ragini','Suresh','Tara'
  ];

  get totalCount(){ return this.outerNames.length + this.middleNames.length + this.innerNames.length; }

  @ViewChild('ring1', { static: true }) ring1Ref!: ElementRef<HTMLUListElement>;
  @ViewChild('ring2', { static: true }) ring2Ref!: ElementRef<HTMLUListElement>;
  @ViewChild('ring3', { static: true }) ring3Ref!: ElementRef<HTMLUListElement>;

  isSpinning = false;
  lastWinner: { name: string; layer: number; layerLabel: string } | null = null;

  itemTransform(i: number, total: number, radius: number): string {
    const angle = (i / Math.max(total, 1)) * 360;
    return `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`;
  }

  private ringsMeta(){
    return [
      { el: this.ring1Ref?.nativeElement, total: this.outerNames.length, layerLabel: 'Outer' },
      { el: this.ring2Ref?.nativeElement, total: this.middleNames.length, layerLabel: 'Middle' },
      { el: this.ring3Ref?.nativeElement, total: this.innerNames.length, layerLabel: 'Inner' },
    ];
  }

  spin(){
    const rings = this.ringsMeta();
    const layer = Math.floor(Math.random() * rings.length);
    const total = rings[layer].total || 1;
    const index = Math.floor(Math.random() * total);

    // winner info
    const name = [this.outerNames, this.middleNames, this.innerNames][layer][index];
    this.lastWinner = { name, layer, layerLabel: rings[layer].layerLabel };

    // Pause CSS animations, then use transforms to decelerate to target
    this.isSpinning = true;

    const baseSpins = 6; // dramatic extra turns
    rings.forEach((r, idx) => {
      const step = 360 / Math.max(r.total, 1);
      const target = (idx === layer) ? (index * step) : (Math.floor(Math.random() * Math.max(r.total, 1)) * step);
      const offset = (idx === 0 ? 20 : idx === 1 ? 10 : 0); // slight visual offsets
      const finalDeg = baseSpins * 360 + target + offset;

      if (r.el) {
        r.el.classList.add('spinning');
        r.el.style.transform = `rotate(${finalDeg}deg)`;
        const tidy = () => {
          r.el?.classList.remove('spinning');
          if (r.el) r.el.style.transform = '';
          r.el?.removeEventListener('transitionend', tidy);
        };
        r.el.addEventListener('transitionend', tidy);
      }
    });

    // After the transitions complete (~4.6s), resume idle animation
    setTimeout(() => { this.isSpinning = false; }, 4700);
  }
}
