<template>
    <div class="pt-big">

        <div class="filter-bar">
            <div class="user-filter">
                <h5 class="inline">משתמשים:</h5>
                <multiselect class="dropdown w-elastic-30 maxw-300 mb-med" 
                    placeholder="פילטור משתמשים לפי"
                    v-model="filters.selection.users.active" 
                    track-by="value" 
                    label="label" 
                    :options="filters.selection.users.options"
                    :show-labels="false"
                    :searchable="false"
                    :close-on-select="true"
                    :allow-empty="false"></multiselect>
            </div>
            <div class="test-filter">
                <h5 class="inline">מבחנים:</h5>
                <multiselect class="dropdown w-elastic-30 maxw-300" 
                placeholder="תבחר סוג"
                v-model="filters.selection.tests.active" 
                track-by="value" 
                label="label" 
                :options="categories"
                :show-labels="false"
                :searchable="false"
                :close-on-select="true"
                :allow-empty="false"></multiselect>
            </div>
            <date-range class="pb-small" v-if="!!filters.selection.users.active && filters.selection.users.active.value==='date'" v-model="filters.active.date"></date-range>
            <multiselect 
                    v-if="!!filters.selection.users.active && filters.selection.users.active.value==='users'" class="dropdown w-elastic-30 maxw-300 mb-med" 
                    placeholder="הקלד שם משתמש/ים"
                    v-model="filters.active.users" 
                    :options="filters.selection.users.tags"
                    @tag="addTag"
                    track-by="value" 
                    label="label" 
                    :taggable="true"
                    :multiple="true"
                    :show-labels="false"></multiselect>
            <button class="btn btn-primary pl-small pr-small center block mt-big" @click="fetchStatistics(filters.active)">חשב סטטיסטיקות</button>
        </div>
        <div v-if="!!charts.length && !loadingstatistics" class="stats-wrap">
            <div v-for="(chart, index) in charts" :key="index" :class="['chart', !!chart.fullwidth ? 'w100' : '']">
                <component :is="chart.type" :data="chart.data" :options="chart.options"></component>
            </div>
        </div>
        <preloader :backdrop="false" pretitle="טוען סטטיסטיקות" v-if="!!loadingstatistics"></preloader>

        
    </div>
</template>
<script>

/*
    Statistics::
    HOW?
    
    1. Get the correct group of users to operate on.
    FILTERS:
        users: ['username', 'group', 'all']
        tests: ['id' 'category', 'code']
*/
import { mapState, mapActions } from 'vuex'
import { categories } from '/imports/api/categories'

import DateRange from '/client/ui/components/form/DateRange.vue'

import LineChart from './charts/LineChart'
import BarChart from './charts/BarChart'
export default {
    data() {
        return {
            statsdata:null,
            categories,
            filters: {
                active: {
                    date: null,
                    users: [],
                    all: false
                },
                selection: {
                    users: {
                        active: null,
                        options: [
                            {
                                label: 'תאריך',
                                value: 'date'
                            },
                            {
                                label: 'משתמשים',
                                value: 'users'
                            },
                            {
                                label: 'כולם',
                                value: 'all'
                            },

                        ],
                        tags: [
                            
                        ]
                    },
                    tests: {
                        active: null,
                        options: [
                            {
                                label: 'מבחן ספציפי',
                                value: 'date'
                            },
                            {
                                label: 'משתמשים',
                                value: 'users'
                            },
                            {
                                label: 'כולם',
                                value: 'all'
                            },

                        ]
                    }
                }
            },
            charts: []
        }
    },
    watch: {
        'filters.selection.users.active'() {
            let activeSelection = this.filters.selection.users.active.value;
            if (activeSelection!='date') {
                this.filters.active.date = null;
            }
            if (activeSelection!='users') {
                this.filters.active.users = [];
            }
            if (activeSelection!='all') {
                this.filters.active.all = false;
            } else {
                this.filters.active.all = true;
            }
        },
        'statisticsData'() {
            this.$set(this, 'charts', []);
            console.log('data for statistics changed >> ', this.statisticsData);
            let statisticsData = this.statisticsData;
            let testcat = this.filters.selection.tests.active;
            if (!!testcat) {
                _.forEach(statisticsData, user => {
                    user.profile.tests = _.filter(user.profile.tests, test => test.meta.category===testcat.value);
                })
            }
            statisticsData = _.filter(this.statisticsData, obj => !!obj.profile.tests && !!obj.profile.tests.length);
            let orderedByTestsLength = _.orderBy(statisticsData, obj=> { return obj.profile.tests.length}, ['desc']);
            orderedByTestsLength = _.map(orderedByTestsLength, user => {
                return {
                    _id:user._id,
                    username: user.username,
                    tests: user.profile.tests
                }
            })
            console.log('statsdata > ', orderedByTestsLength);
            this.$set(this, 'statsdata', orderedByTestsLength);
            this.computeStatistics();
            
        },
        'selection.tests.active'() {
            if (!!this.selection.tests.active && !!this.statisticsData) {
                // this.$set(this.chart, '0', this.buildChart(this.selection.tests.active));
            }
        }
    },
    components: {
        DateRange,
        LineChart,
        BarChart
    },
    computed: {
        ...mapState('usersModule', [
            'users',
            'loadingusers',
            'loadingMoreUsers',
            'loadingstatistics',
            'statisticsData'
        ]),
    },
    methods: {
        ...mapActions('usersModule', 
        [
            'fetchStatistics'
        ]),
        addTag(newTag) {
            const tag = {
                label: newTag,
                value: newTag
            }
            this.filters.selection.users.tags.push(tag)
            this.filters.active.users.push(tag);
        },
        computeStatistics() {
            let testCategory = this.filters.selection.tests.active;
            // let usersData = this.statsdata;
            

            if (!!this.statsdata && this.statsdata.length===1) {
                this.buildPerUserCharts();
                // this.buildPerUserRegulatoryScoreChart(usersData);
                // this.buildAnswerAnalysisChart(usersData);
            }
            /* 
                TODO ::
                ------------
                Regulatory Score Chart < עקומת למידה
                y - Regulatory Score
                x - tests
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [0, 10, 5, 2, 20, 30, 45],
                    }]
                },
            */

        },
        buildPerUserCharts() {
            let charts = this.charts;
            let userTests = this.statsdata[0].tests;
            let labels = Array.apply(null, {length: userTests.length}).map(Number.call, Number)
            
            let chart1 = this.buildSummaryChart(this.statsdata, ['מבחן ראשון', 'ממוצע מבחנים', 'מבחן אחרון'])

            let chart2 = this.buildPerUserRegulatoryScoreChart(this.statsdata, labels);
            charts.push(chart2);

            let chart3 = this.buildAnswerAnalysisChart(this.statsdata, labels);
            charts.push(chart3);


            console.log('charts . ', charts);
            this.$set(this, 'charts', charts) 
        },
        buildSummaryChart(usersData, labels) {
            let chart = { type: 'line-chart', data:null},
                datasets = [];
                
            // Regulatory Scores Array
            let rs = _.map(user.tests, 'regulatoryScore');
            // [ first score, average score, last score]
            let data = [rs[0],_.sum(rs)/rs.length, _.last(rs) ]
            _.forEach(usersData, user => {
                datasets.push({
                    label: user.username,
                    backgroundColor: 'rgba(255, 99, 132, 0.08)',
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    data
                })
            })
            chart.data = {
                labels,
                datasets
            }
            chart.options = {
                title: {
                    display: true,
                    text: "עקומת למידה",
                    fontSize: 16
                },
                tooltips: {
                    callbacks: {
                        title() {
                            return false
                        },
                        label(tooltipItem,data) {
                            return tooltipItem.yLabel
                        }
                    }
                }
            }
            return chart;
        },
        buildAnswerAnalysisChart(usersData, labels) {
            let chart = { type: 'line-chart', data:null},
                datasets = []
            _.forEach(usersData, user => {
                datasets.push({
                    label: "נכונות",
                    backgroundColor: 'rgba(11,221,190, 0.05)',
                    borderColor: 'rgba(11,221,190, 0.5)',
                    data: _.map(user.tests, 'correct')
                })
                datasets.push({
                    label: "שגיאות",
                    backgroundColor: 'rgba(234,107,107, 0.05)',
                    borderColor: 'rgba(234,107,107, 0.5)',
                    data: _.map(user.tests, 'wrong')
                })
                datasets.push({
                    label: "לא נענו",
                    backgroundColor: 'rgba(221,222,224, 0.05)',
                    borderColor: 'rgba(221,222,224, 0.5)',
                    data: _.map(user.tests, 'unanswered')
                })
            })
            chart.data = {
                labels,
                datasets
            }
            chart.options = {
                title: {
                    display: true,
                    text: 'התפלגות תשובות',
                    fontSize: 16
                },
                tooltips: {
                    callbacks: {
                        title() {
                            return false
                        },
                        label(tooltipItem,data) {
                            return tooltipItem.yLabel
                        }
                    }
                }
            }
            return chart;
        },
        buildPerUserRegulatoryScoreChart(usersData, labels) {
            let chart = { type: 'line-chart', data:null},
                datasets = [];
            _.forEach(usersData, user => {
                datasets.push({
                    label: user.username,
                    backgroundColor: 'rgba(255, 99, 132, 0.08)',
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    data: _.map(user.tests, 'regulatoryScore')
                })
            })
            chart.data = {
                labels,
                datasets
            }
            chart.options = {
                title: {
                    display: true,
                    text: "עקומת למידה",
                    fontSize: 16
                },
                tooltips: {
                    callbacks: {
                        title() {
                            return false
                        },
                        label(tooltipItem,data) {
                            return tooltipItem.yLabel
                        }
                    }
                }
            }
            return chart;
        }
        
    }
}
</script>
<style lang="stylus">
.filter-bar
    padding 0 5%
    .user-filter
        display inline-block
        width 45%
    .test-filter
        padding-right 10px
        border-right 1px solid lightgray
        display inline-block
        width 50%
    h5
        display inline-block
        margin-left 5px
.chart
    display inline-block
    vertical-align middle
    width 45%
    padding 2%
</style>