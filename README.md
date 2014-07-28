WASTE
=====

1. Introduction
Without adequate security, anyone connected to the internet could be subjected to an attack. Security will only hold as strong as its weakest link. 

To illustrate the extent of the importance of web security, let us consider the situation where communication between the client and the server is relatively secured over the untrusted network through the use of modern encryption schemes. 

Despite being secured on the network level, a malicious attacker could find and exploit bugs on the application level. 

One fine example would be exploiting using the Cross-Site Scripting (XSS) attack, a known attack to allow attackers deploy their scripts on the website. The client with no experience, using an unsecured browser, would have succumbed to the attack unknowingly.  

With that being said, one should not start to block off all communication to/from the internet as it would only lead to a false sense of security. Therefore, it is more important to fix the problem rather than avoiding it. 

The three web application security risks that this paper covers are SQL Injection, Cross-Site Scripting (XSS) and Cross-Site Request Forgery (XSRF).

For the web users, this paper will describe some paranoia methods of browsing web applications; Some of the methods may appear cumbersome but would provide a reasonable amount of security when browsing online.

For the web developers, this paper tries to instil a set of know-hows to securing their web applications by highlighting a few of the top web application vulnerabilities found in many of the websites currently hosted on the internet. The paper will introduce a browser extension which web developers can use to help build their defense through offense. 

It is important to note that everyone has a part to play in security; The best way to start  defending is to be familiar with the various attack vectors.