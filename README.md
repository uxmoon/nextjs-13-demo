# Next Js 13 Crash Course

Notes from [Next.js Crash Course](https://www.youtube.com/watch?v=Y6KDk5iyrYE) from [Traversy Media](https://www.youtube.com/@TraversyMedia) YouTube channel.

:rocket: [View Demo](https://nextjs-13-demo-fauhlowk8-uxmoon.vercel.app/)

---

# Routes

Create pages in folders with the name of the url slug

`app/page.js` is the home page

Add new pages under a folder

`app/about/page.jsx`

Nested routes

Add a new folder under an existing one

`app/about/team/page.jsx`

---

## Layout

`app/layout.js`

Is the main layout component.

If you need an additional layout, you can create for each page.

### New layouts

`app/about/layout.jsx`

This layout will be used in the about page and any nested page/router.

### Metadata

The `metadata` object will have all the global meta tags info.

- `app/layout.jsx` will have the metadata by default
- In new pages you need to export the metadata variable
    - If you add the metadata in a layout it will affect all the child routes

```jsx
// app/about/page.jsx
export const metadata = {
  title: 'About page',
};
const AboutPage = () => {
```

---

# Fonts

Import the font you need at the top, specify weights and subsets in an object variable, and apply to the body tag using dot notation.

```jsx
// app/layout.jsx
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
```

---

# Components

Add a new folder under `app`, use PascalCase for the component name.

`app/components/Header.jsx`

## React Server Components

By default all components are server side components unless you specify a client component.

There pros and cons of RSC

- Loads faster, smaller client bundle size, SEO Friendly, hide sensitive data from the client, more secure, improved DX

The cons are

- Not as interactive, no component state and no lifecycle methods.

## Client Side Component

Add `'use client'` at the top of the file.

<aside>
💡 if you use a `console.log()` you need to check the terminal for the response in RSC, or in the browser for CSC.

</aside>

---

# Data fetching

We can use `fetch` with an async function that return a promise that can be consumed in the page component.

```jsx
async function fetchRepos() {
  const response = await fetch('https://api.github.com/users/uxmoon/repos');
  const repos = await response.json();
  return repos;
}
const ReposPage = async () => {
  const repos = await fetchRepos();
  return (
    <>
      <h1>Repos page</h1>
      {repos[0].name}
    </>
  );
};

export default ReposPage;
```

## Loader

You can add a loading page component to display a spinner without using state like in React. Works automatically with a RSC and it’s fetching data it will display the loading page.

`app/loading.jsx`

```jsx
const LoadingPage = () => {
  return (
    <div className='loader'>
      <div className='spinner'></div>
    </div>
  );
};

export default LoadingPage;
```

---

# Dynamic routes

When we click in a repo link we need to display a page.

```markdown
app/code/repos/page.jsx ==> display repos list
app/code/repos/[name]/page.jsx ==> display repo details
```

In the repos list page we added a `Link` that points to `/code/repos/${name}` and the page for each item displays all the details.

```jsx
const RepoPage = ({ params: { name } }) => {
  return (
    <div className='card'>
      <h2>{name}</h2>
      <p>Repo details</p>
    </div>
  );
};

export default RepoPage;
```

We want to display the information using a Suspense Boundary.

We create a couple of components for a repo, to display a title, description and stats. And another to display the directories. The latter will take 3 seconds to display the information.

We import `Suspense` from React and wrap each component.

```jsx
import { Suspense } from 'react';
import Repo from '@/app/components/Repo';
import RepoDirs from '@/app/components/RepoDirs';
import Link from 'next/link';

const RepoPage = ({ params: { name } }) => {
  return (
    <div className='card'>
      <Link href='/code/repos' className='btn btn-back'>
        Back to repository list
      </Link>
      <Suspense fallback={<div>Loading repo...</div>}>
        <Repo name={name} />
      </Suspense>
      <Suspense fallback={<div>Loading directories...</div>}>
        <RepoDirs name={name} />
      </Suspense>
    </div>
  );
};

export default RepoPage;
```

It will improve the UX to display the information and notify the user of an action taking place.

---

# Caching

By default NextJs store cache indefinitely but there’s an option.

## Revalidate

Tells next js how often to check for data.

### Usage

Add an object to the fetch API as a second parameter. It’s ideal for data that often changes.

```jsx
async function fetchRepoContents(name) {
  const reponse = await fetch(
    `https://api.github.com/repos/uxmoon/${name}/contents`,
    {
      next: { revalidate: 60 },
    }
  );
  const repo = await reponse.json();
  return repo;
}
```

---

# API route handlers

Allows you to create custom request handler for a given route.

Path: `app/api`

Example: `app/api/hello/route.js`

URL: `http://localhost:3000/api/hello`

You can have router handlers within your page routes, but in the `api` folder it will be prefixed with `/api/`

In the file you define the method `GET` or `POST`

## Example: Courses

Add a route that return courses.

Files: `app/api/courses/data.json,router.js`

URL: `http://localhost:3000/api/courses`

```jsx
// api/courses/router.js

import { NextResponse } from 'next/server';
import courses from './data.json';

export async function GET(request) {
  return NextResponse.json(courses);
}
```

## Example: Query params

URL: `http://localhost:3000/api/courses/search?query=react`

How to get the query value.

```jsx
import { NextResponse } from 'next/server';
import courses from '../data.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  console.log(searchParams.get('query')); // --> query=react gets react

  const query = searchParams.get('query');
  const filteredCourses = courses.filter((course) => {
    return course.title.toLowerCase().includes(query.toLocaleLowerCase());
  });
  return NextResponse.json(filteredCourses);
}
```

## Example: body params

Get data from the body

Files: `app/api/courses/router.js`

In **Postman**, create a new tab, set to **POST** and select **Raw** under **Body** to add a new course manually.

```jsx
export async function POST(request) {
  const { title, description, level, link } = await request.json();
  const newCourse = {
    id: uuidv4(),
    title,
    description,
    level,
    link,
  };
  courses.push(newCourse);
  return NextResponse.json(courses);
}
```

---

# Client components

Fetching from the homepage.

We update `app/page.jsx` to `'use client'` to add React hooks.

- Add `'use client'` to convert it to a client side component
- The `loading.jsx` page will not automatically work, add it manually
- Add 2 states for the courses list and the loading animation
- Add a side effect to fetch all courses
- Add search and courses list components

Create a search form component and update the course list component.