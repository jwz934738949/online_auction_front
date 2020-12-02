<template>
  <div>
    <!-- 轮播图 -->
    <el-carousel height="450px" direction="vertical" autoplay loop>
      <el-carousel-item>
        <el-image
          :src="require('../assets/carousel_img1.png')"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          :src="require('../assets/carousel_img2.png')"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          :src="require('../assets/carousel_img3.png')"
          fit="fill"
        ></el-image>
      </el-carousel-item>
      <el-carousel-item>
        <el-image
          :src="require('../assets/carousel_img4.png')"
          fit="fill"
        ></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
