const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongooose = require("mongoose");
const Users = require("../models/user");
const User = mongooose.model("users");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },
        async (username, password, done) => {
            const q = await User.findOne({ email: username }).exec();
        if (!q) {
            return done (null, false, {
            message: "incorrect username. ",
            });
        }
        if (!q.validPassword(password)) {
            return done(null, false, {
                message: "incorrect password. ",
            });
        }
        return done(null, q);
        }
    )
);