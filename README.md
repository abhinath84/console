| NOTE:            |
| :--------------- |
| Work in progress |

<div align="center">
  <h1>CSLOAD</h1>
</div>

**Table of Contents**

-   [Introduction](#introduction)
-   [User Interaction](#user-interaction)
    -   [Login](#login)
    -   [Dashboard](#dashboard)
    -   [Test Session](#test-session)
        -   [User Input](#user-input)
        -   [Run](#run)
    -   [Result](#result)
-   [References](#references)

## <a name='introduction'></a>Introduction

A load testing framework for creo-saas backend services. Framework supports to write scenario based test script. Its implemented as distributed system. Backend server & simulation service (which manage & execute test script) are hosted separately and communicate with each other whenever needed.

Framework has several benefits:

-   Scenario based test script.
-   Run test is simple & easy.
-   Can run sub-test scripts in different processes & it can controlled dynamically.
-   Framework is module based and easy to add/remove modules.
-   Rich utility library support.
-   Can write test script by following few simple steps.

## <a name='user-interaction'></a>User Interaction

Framework provides a mockup page for user interaction such as login, dashboard, run test script from test module.
To access mockup page navigate to `http://<server-url>/mockup.html`.

> you can try on: [http://peremoga.ptcnet.ptc.com:8000/mockup.html](http://peremoga.ptcnet.ptc.com:8000/mockup.html)

### <a name='login'></a>Login

Below is the screenshot of login page.

<img src="./docs/images/mockup-login.png" width="700px" height="350px" alt="Login" title="Login">

To login user needs to provide:

-   **_URL_**: creo-saas backend service url for which user wants to execute load testing. This is a **mandatory** field.

and Either:

-   **_Username_**: user id or email to login creo-saas backend service.
-   **_Company_**: company to login creo-saas backend service.

OR

-   **_Api Key_**: Api-key to login creo-saas backend service.

> Here is a sample login input:
>
> <img src="./docs/images/mockup-login-filled.png" width="700px" height="350px" alt="Login filled" title="Login filled">

After successful login, user will be redirect to [Test Session](#test-session) page if first time login, otherwise [Dashboard](#dashboard) page.

### <a name='dashboard'></a>Dashboard

<img src="./docs/images/mockup-dashboard.png" alt="Dashboard" title="Dashboard">

### <a name='test-session'></a>Test Session

<img src="./docs/images/mockup-test-modules.png" alt="Test Modules" title="Test Modules">

#### <a name='user-input'></a>User Input

<img src="./docs/images/mockup-test-user-input.png" alt="Test user input" title="Test user input">

#### <a name='run'></a>Run

<img src="./docs/images/mockup-test-run.png" alt="Test Run" title="Test Run">

### <a name='result'></a>Result

<img src="./docs/images/mockup-test-result.png" alt="Test Result" title="Test Result">

## <a name='references'></a>References

-   [Developer Guides](./docs/developing.md#developing)
