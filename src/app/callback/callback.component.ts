import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  type: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
    this.type = route.snapshot.params['type'];
  }

  async ngOnInit() {
    switch (this.type) {
      case 'signin':
        {
          const returnUrl = await this.authService.signinCallback();
          this.router.navigate([returnUrl]);
          break;
        }
      default:
        break;
    }
  }
}
