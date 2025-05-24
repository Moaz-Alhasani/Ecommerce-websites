import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../prisma";
import { forbiddenExcption } from "../../../globals/middlware/error.middlware";




passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
    try {
        const oldUser = await prisma.user.findFirst({
            where: {
                id: id,
            },
    });
        done(null, oldUser); 
    } catch (error) {
        done(error, null);
    }
});


export default passport.use(new GoogleStrategy({
    callbackURL: "/google/redirect",
    clientID: "Your clientID",
    clientSecret: "your clientServet"
}, 
    async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await prisma.user.findFirst({
            where: { googleId: profile.id },
            });

        if (existingUser) {
            return done(null, existingUser); 
        }
        else {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        const newUser = await prisma.user.create({
            data: {
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            password: null,
            }
        });
        return done(null, newUser);
        }
    } catch (error) {
        return done(error, undefined);
    }
    }
));


