- uses shadcn - alot of people like to use shadcn making this fit right in
- uses env validation as some people prefer to jump right in.
- all components inside of the dashboard easy to copy and paste, thought it might be a good idea while spending alot of time coming up with landing-page designs.

# Set up Creem

- create new store on creem
- get the api key
- get the webhook secret
- make sure the webhook domain ends with `/api/webhook/creem`

# Set up Supabase

- create a new project on supabase
- run the migration files
- go to "Authentication" then "URL Configuration" and add correct urls (redirect url should end with `/sign-in/confirm`)
- **make sure to insert `credit_plans` table with the correct `creem_product_id` and `credits_per_cycle` values**

# Set up enviroment variables

- copy the `.env.example` file to `.env`
- fill in the values

# Set up google oauth

- go to your supabase dashboard
- go to the "Authentication" tab and then "Sign In / "Providers"
- search for "Google" and enable it
  (more at [supabase docs](https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=framework&framework=nextjs#configure-your-services-id))

# Set up email auth

- make sure to set up your own SMTP server for email verification
- go to your supabase dashboard
- go to the "Authentication" tab and then "Email"
- read the warning and click "Set up SMTP"
- you can also customize the email templates

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fms0-dev%2Fsupacreem)