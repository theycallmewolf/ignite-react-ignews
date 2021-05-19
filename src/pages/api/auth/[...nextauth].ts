import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import {query as q} from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
      // @see: https://docs.github.com/en/developers/apps/scopes-for-oauth-apps
    }),
  ],
  callbacks: {
    async session(session) {
      const userActiveSubscription = await fauna.query(
        q.Get(
          q.Intersection([                            // other options: Difference, Union
            q.Match(
              q.Index('subscription_by_user_ref'),
              q.Select(                               // choose dataset
                'ref',
                q.Get(                                // get data
                  q.Match(                            // find record
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                  )
                )
              )
            ),
            q.Match(
              q.Index('subscription_by_status'),
              'active'
            )
          ])
        )
      )
      return {
        ...session,
        activeSubscription: userActiveSubscription,
      };
    },
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true;
      } catch {
        return false;
      }
    },
  }
})