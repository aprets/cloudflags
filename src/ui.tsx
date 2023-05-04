/* eslint-disable react/no-unknown-property */
/* eslint-disable react/style-prop-object */
/* eslint-disable import/prefer-default-export */
import { html } from 'hono/html';

const Layout = (props: { children?: string }) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg" href="/static/favicon.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>CloudFlags</title>
      <meta name="robots" content="noindex, nofollow" />
      <link rel="stylesheet" href="/static/tailwind.css" />
    </head>
    <body>
      ${props.children}
    </body>
  </html>
`;

export const Index = ({ flags }: { flags: { name: string; enabled: boolean }[] }) => (
  <Layout>
    <main class="mx-auto mt-16 flex flex-col items-center w-full sm:max-w-md">
      <h1 class="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
        CloudFlags
      </h1>
      <div class="flex flex-col gap-4 w-full">
        {flags.map((flag) => (
          <div class="bg-white shadow sm:rounded-lg">
            <div class="p-6">
              <div class="mt-2 flex items-start justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900 overflow-auto" id="renew-subscription-label">
                  {flag.name}
                </h3>
                <div class="flex flex-row">
                  {!flag.enabled && (
                    <form class="flex-shrink-0 flex items-center" action="/remove" method="POST">
                      <input type="hidden" name="flag" value={flag.name} />
                      <button
                        type="submit"
                        class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg
                          class="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </form>
                  )}
                  <form
                    class="ml-2 flex-shrink-0 flex items-center"
                    action={flag.enabled ? '/disable' : 'enable'}
                    method="POST"
                  >
                    <input type="hidden" name="flag" value={flag.name} />
                    <button
                      type="submit"
                      class={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        flag.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                      onclick={`return confirm('Are you sure you want to ${
                        flag.enabled ? 'disable' : 'enable'
                      } the flag?')`}
                    >
                      <span
                        class={` inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          flag.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Add a new flag</h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <p>The flag will be added as disabled</p>
            </div>
            <form class="mt-5 sm:flex sm:items-center" action="/add" method="POST">
              <div class="w-full sm:max-w-xs">
                <input
                  type="text"
                  name="flag"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="SECRET_FUNCTION"
                />
              </div>
              <button
                type="submit"
                class="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </Layout>
);
