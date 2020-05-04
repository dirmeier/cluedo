## TODO

- remove some code form classes to dedicated classes (such as dijkstra)
- remove getters that are difficult to understand like below and replace with more verbose calls 

```
get cards() {
    return this.model.game.cards
}
```

- have a look into clean MVC design with bots. the current solution seems sub-optimal
- generally improve/beautify UI and use my conventional CSS
- landing page with dynamic setting of `nPlayers`
- clean up/lint/check JS
- convert to Typescript
- add codacy
- implement bots to be able to play alone (i.e., RL/NN)
- add e2e and integration tests
