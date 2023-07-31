# Contributing

If you're thinking of contributing, thank you 🎉

---

## Environment

You will need these tools installed on your system:

- [**Docker**](https://www.docker.com/products/docker-desktop/)
- [**Node.js**](https://nodejs.org/pt-br/download/current)

---

## Testing

The tests are dynamic and can be easily run by performing:

```sh
USER='root' PASS='root' npm run tests
```

- You can also set a custom `HOST` and `PORT`

To clean up the container and files from tests, perform:

```
npm run tests:reset
```

---

## Issues and Pull Requests

By opening an **Issue** or submit a **Pull Request**, describe your problem or solution. If you can share a basic repro, it will be great.

If you added a feature, make sure you enabled it in [_./src/tests/mount.ts_](./src/tests/mount.ts#15).

> Naturally, please **be respectful** 🙋🏻‍♂️
