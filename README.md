# Blurp Front End

# Blurp

Blurp is a web application written in React + Express + MongoDB.

<img align="right" width="159px" src="https://raw.githubusercontent.com/dan-trang/MyFiles/main/blurp_noslogan-removebg-preview.jpg">

## Cloning this Repo

To get developing, you'll want to clone this repository first. You'll also want to create your own working branch so that your `git push` doesn't overwrite the main branch.

1. Go to your terminal and `cd` into a working folder you want to work in.

2. Now run `git clone https://github.com/pdx-blurp/blurp-frontend.git`.

3. Next, make sure that you're linked to this remote repo by running these two commands:

```
git remote add origin https://github.com/pdx-blurp/blurp-frontend.git
```

```
git remote set-url origin https://github.com/pdx-blurp/blurp-frontend.git
```

4. Add a new working branch in your local and change to it: `git checkout -b <first name><last initial>/<purpose of branch>`. Ex: `danielt/fixing-stuff`

Now, you should be all set up to start developing!
**TIP:** _When developing via the browser, use Incognito mode to avoid those nasty cookies!_

## Running the Server

We'll be using Docker Containers soon TM. For now, navigate to /blurp-app and do the following:

```
> npm install
> npm run dev
```

This should boot up the React pages via Vite.

Once there, open up the developer console to view requests and responses. For WINDOWS `Ctrl Shift J` or MAC `Ctrl Option J`. Select the <u>Network</u> table and see your requests by <u>Name</u> and <u>Status</u>.

If you want more detail on a specific event, click its <u>Name</u> to see a more detailed view.
