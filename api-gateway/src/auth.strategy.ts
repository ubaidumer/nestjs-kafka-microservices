import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebaseAdmin from 'firebase-admin';

// strategy that is required to be implemented when authentication takes place with out any credentials
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'auth-strategy') {
  private defaultApp: any;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.defaultApp = firebaseAdmin;
  }

  // gets called automatically when strategies guard gets called for validation purposes
  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        throw new UnauthorizedException(err.message);
      });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }
    return {
      id: firebaseUser.user_id,
      role: firebaseUser.userType,
    };
  }
}
