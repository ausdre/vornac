# auth.md

This file tells AI agents how access to VORNAC works. VORNAC GmbH (Heidelberg, Germany) runs a platform for continuous, autonomous penetration testing. In short: public content needs no credentials, and agents cannot register for the platform.

VORNAC does not implement the auth.md agent registration protocol. There is no registration endpoint, no claim flow and no OAuth metadata on this domain. This file documents the real access path instead.

## Public content

Everything on https://www.vornac.com is public and needs no authentication. Start at https://www.vornac.com/llms.txt. Every page is available as Markdown at its URL plus `.md`. Skills for agents are listed at https://www.vornac.com/.well-known/agent-skills/index.json.

## Platform access

The platform is open to customers with a signed contract only.

1. Access starts with a 30-minute intro call: https://zeeg.me/hello3950/your-vornac-meeting or hello@vornac.com.
2. After the contract is signed, VORNAC creates the user accounts during onboarding. There is no self-service sign-up.
3. Customers create API tokens themselves in the platform and revoke them there.

## If you are an agent

- Acting for a prospective customer: you cannot register, buy or start a test. Prepare the request with the `vornac-pentest-scoping` skill and hand the booking link to the person you act for.
- Acting for an existing customer: use only an API token that your principal created in the platform and passed to you for this purpose. VORNAC issues no separate agent identities.
- Do not try to create accounts, guess or reuse credentials, or automate the login of a human user.

## Revocation

The customer revokes an API token in the platform. Questions about user accounts go to hello@vornac.com.

## Testing needs authorisation

A penetration test runs only under a signed contract and only against systems the customer is authorised to have tested. An agent must never request a test against a system on its own initiative.

## Contact

VORNAC GmbH, Carl-Friedrich-Gauß-Ring 5, 69124 Heidelberg, Germany. hello@vornac.com, +49 6221 6479525. Security reports: https://www.vornac.com/.well-known/security.txt
