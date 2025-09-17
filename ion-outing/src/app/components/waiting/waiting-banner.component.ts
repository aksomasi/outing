import { Component, Input } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-waiting-banner',
  standalone: true,
  imports: [NgFor, NgStyle],
  templateUrl: './waiting-banner.component.html',
  styleUrls: ['./waiting-banner.component.scss']
})
export class WaitingBannerComponent {
  /** Background images to cycle */
  @Input() images: string[] = [];

  /** Seconds each image stays visible (including fade) */
  @Input() duration = 6;

  /** Seconds of cross-fade overlap */
  @Input() fade = 1.2;

  /** Optional main headline/subtext */
  @Input() title = '🚀 Let’s wait for a moment… Soon the new TEAMS start blast! 🎉';
  @Input() subtitle = 'Get ready to enjoy the fun and excitement ✨';

  trackByIdx(_i: number) { return _i; }
}
