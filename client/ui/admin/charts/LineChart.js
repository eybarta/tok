import { Line } from 'vue-chartjs'

export default Line.extend({
  props: {
    data: {
      required:true,
      type: Object
    },
    options: {
      required: false,
      default: {responsive: true, maintainAspectRatio: false}
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
})