# Backend Coding Challenge

## Overview
We ask you to build a miniature version of an order management system. It should include information
about an order’s current state, customer, line items, creation and last update time. The order may
have the following states:
OPEN -> IN_PROGRESS -> DONE

When an order’s state is “IN_PROGRESS”, it must know which employee is assigned to this order. This
backend service shall expose the orders through an GraphQL API, including mutations for transitioning
through the order’s states. The state transitions are only possible in order, reverting to a previous
state or skipping a state is not allowed.
Rules for programming style apply per your own preferences and documentation can be kept down
to a minimum. Your application should be able to handle wrong input by the user and any unusual
behaviour.
For this scenario we expect you to deliver a high-quality application. Please use all available ES6+
features, including async programming style. Your backend service should be structured into
functional modules and have reasonable configuration management.