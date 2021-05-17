import {query as q} from 'faunadb';
import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
){

  // get user from faunaDB (customerId)
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  // get subscription data from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }
  
  // save data subscription on faunaDB
  if(createAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      // approach 1 -> update only the status of the record
      // q.Update(
      //   q.Select(
      //     'ref',
      //     q.Get(
      //       q.Match(
      //         q.Index('subscription_by_id'),
      //         subscriptionId,
      //       )
      //     )
      //   ),
      //   { data: {status: subscriptionData.status} }
      // )

      // approach 2 -> replace all record
      q.Replace(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptionId,
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
  
}