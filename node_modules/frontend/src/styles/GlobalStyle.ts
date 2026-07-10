import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  button {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }
`
