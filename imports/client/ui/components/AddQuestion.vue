<template>
    <div class="add-wrap">
        <h2>Add Question</h2>

        <h3>Matrix</h3>
        <div class="matrice-grid">
            <div class="grid-cell">
                <svg>
                    <g>
                        <polygon points="100,20 169.28203230275508,59.99999999999999 169.2820323027551,140 100.00000000000001,180 30.717967697244916,140.00000000000003 30.717967697244873,60.00000000000006"></polygon>
                    </g>
                </svg>

            </div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
            <div class="grid-cell"></div>
        </div>
        
        
    </div>
</template>
<script>
    export default {

    }
</script>
<style lang="stylus" scoped>
h2
    font-size 50px
    padding 40px
.add-wrap
    position absolute
    width 60vw
    height 100vh
    border-left 1px solid rgba(#202020, 0.2)
    border-right 1px solid rgba(#202020, 0.2)
    top 50%
    left 50%
    transform translate(-50%,-50%)


polygon 
    fill #42b983
    opacity .75
</style>