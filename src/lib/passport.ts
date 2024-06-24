import passport from "passport";
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import { NextResponse, NextRequest } from "next/server";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { userDAO } from "../../DAO/user.dao";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;

const cookieExtractor = (req: NextRequest): string | null => {
  let token: RequestCookie | undefined = undefined;
  if (req && req.cookies) {
    token = req.cookies.get("access_token");
    if (token) {
      const tokenVal = token.value;
      return tokenVal;
    }
  }
  return null;
}

passport.use(new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: "AurickKruger"
}, async (payload, done) => {
  try {
    let user = await userDAO.getUserById(payload.sub);
    return done(undefined, user);
  } catch (err) {
    done(err, false);
  }
}))

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    let user = await userDAO.getUserByUsername(username);
    if (!user) {
      return done(undefined, false, {message: 'Username Not Found'});
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) {return done(err)}
      if (isMatch) {
        return done(undefined, user, { message: "user found" });
      }
      return done(undefined, false, { message: "invalid password" });
    })
  } catch (e) {
    done(e);
  }
}))