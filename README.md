# DNS Checker API - Unlimited use

Open source DNS Checker API with unlimited use, no restrictions applied.

## API Reference (Usage)
1. [https://projects.rares.eu/dns](https://projects.rares.eu/dns)

Using any of the above link, make GET requests following:

```http
  GET https://projects.rares.eu/dns/type/url/dns?
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `type`      | `string` | **Required**. Type (A, AAAA, ...); List below.|
| `url`      | `string` | **Required**. Please note: the domain value should be sent without **`http://`** or **`https://`**|
| `dns`      | `string` | **Optional**. *default: **Google DNS***.<br>Available: Google, Cloudflare, OpenDNS, Verisign, DNSWatch, Freenom, AliDNS & Dyn. List from [publicdns.xyz](https://www.publicdns.xyz/) |

_Please note:_ All parameters are case-insensitive.

Supported types:
- A (including ttl)
- AAAA (including ttl)
- MX
- NS
- SOA
- TXT
- CAA
- CNAME
- NAPTR
- PTR
- SRV
- ALL (when using /all/, the API will return A, AAAA, CAA, CNAME, MX, NS, SOA, SRV and SRV values) 

Examples:
- [https://projects.rares.eu/dns/a/google.com](https://projects.rares.eu/dns/a/google.com)
- [https://projects.rares.eu/dns/txt/google.com](https://projects.rares.eu/dns/a/google.com)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

This project is tested with BrowserStack.
