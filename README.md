# pyramid-scheme

This is a kata exercise i came up with to experiment with the Sails.js framework.

# Story
The system manages users, pyramid schemes and the organizer's treasury.

Users have unique usernames and ids.
Pyramids have unique ids.

Users can be either administrators or participants.
Administrators can't participate in pyramid schemes.

Participants can register freely.
Administrators have to be added by an existing administrator.

Administrators can transfer out funds (tokens) from the treasury.
Participants can transfer funds (tokens) in and out of their account.
Accounts and the treasury can't have a negative amount of funds.

Participants can use deposited funds to start new pyramids, or join an existing pyramid.
Before joining a pyramid, a user can check how much it will cost.
A pyramid can only be joined by specyfying a referrer, and pyramid id.
The user then joins the pyramid as child node of the referrer.

A user can't join a pyramid more than once.

Starting a pyramid costs one token, paid to the treasury.

Joining the pyramid costs twice as much as the referrer paid.
From this sum every person in the chain from referrer to the root of the pyramid is paid the amount they paid to join the pyramid.
The single leftover token is deposited into the treasury as a fee for providing the service.

Administrators can see a list of all pyramids, their founders and the count of their members.
Participants can see a list of pyramids they joined, wether they are the founder, or joined by a referer, and how much revenue it generated them.
