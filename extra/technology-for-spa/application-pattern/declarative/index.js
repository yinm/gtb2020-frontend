new Vue({
  el: '#app',
  data: {
    words: [],
    term: '',
    description: ''
  },
  methods: {
    add() {
      this.words.push({
        term: this.term,
        description: this.description
      })

      this.term = ''
      this.description = ''
    }
  }
})