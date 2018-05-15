
# Style : Mixin

> this is guide for scss that how changed compile with css


## Mixin : break point
- pc *(that's a standard style, usually omitted.)*
    - `$pc` : 1280px~ 
- tablet
    - `$tablet` : 768px~1279px
- mobile
    - `$mobile` : ~767px
- Enter a separate value *(You should check the code that example below.)*

`scss`
```scss
@include break-point($tablet){
    // tablet
}
@include break-point($mobile){
    // mobile
}
@include break-point(1200px,min) {
    // min-width:1200px
}
@include break-point(1900px,max) {
    // max-width:1900px
}
@include break-point(1200px,1440px) {
    // min-width:1200px, max-width:1440px
}
@include break-point(1200px,1440px, portrait) {
    // min-width:1200px, max-width:1440px, portrait
}
@include break-point(600px,minH) {
    // min-height:600px
}
@include break-point(1200px,maxH) {
    // max-height:1200px
}
@include landscape(){
    // 가로 화면
}
@include portrait(){
    // 세로 화면
}
```
compile `css`
```scss
@media only screen and (min-width: 768px) and (max-width: 1280px) {
    // tablet
}
@media only screen and (max-width: 767px) {
    // mobile
}
@media only screen and (min-width: 1200px) {
    // min-width:1200px
}
@media only screen and (max-width: 1900px) {
    // max-width:1900px
}
@media only screen and (min-width: 1200px) and (max-width: 1440px) {
    // min-width:1200px, max-width:1440px
}
@media only screen and (min-width: 1200px) and (max-width: 1440px) and (orientation: portrait) {
    // min-width:1200px, max-width:1440px, portrait
}
@media only screen and (min-height: 600px) {
    // min-height:600px
}
@media only screen and (max-height: 1200px) {
    // max-height:1200px
}
@media only screen and (orientation: landscape) {
    // 가로 화면
}
@media only screen and (orientation: portrait) {
    // 세로 화면
}

```



## Mixin : Other Example

### @b, @e, @m
`scss`
```scss
$component:'test-compoent';

@include b($component) {
    background:#cccccc;

    @include e(header){
        font-size: 14px;

        @include m(css) {
            font-size: 18px;
        }
    };
}
```
compile `css`
```scss
.test-compoent { background: #cccccc; }

.test-compoent__header { font-size: 14px; }

.test-compoent__header--css { font-size: 18px; }
```

### @bg-img
guide the two case to use the `'Background Image'` attribute.
1. general cases
2. For retinal display *(Compiled with `file name + '2x'`)*

`scss`
```scss
$bg-img-path: '../images/';
// general cases
@include bg-img($bg-img-path, 'basic_image.jpg', red);

//add a color value in rgba 
@include bg-img($bg-img-path, 'basic_image.jpg', rgba(255, 255, 255, 0.3));

//for retina display
 @include bg-img($bg-img-path, 'retina_image_width_color.jpg',green, true);
```

compile `css`
```scss
// general cases
background-color: red; background-image: url("../images/basic_image.jpg");

//add a color value in rgba 
background-color: rgba(255, 255, 255, 0.3); background-image: url("../images/basic_image.jpg");

// for retina display 
background-color: green; background-image: url("../images/retina_image_width_color.jpg");

@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2 / 1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) { .background-mixin { background-image: url("../images/retina_image_width_color2x.jpg"); } }
```


### @bg-attr
- `bg-attr(repeat, left, top, background-resize)`
    - `R` : repeat
    - `X` : repeat-x
    - `Y` : repeat-y
    - `N` : no-repeat
 
`scss`
```scss
@include bg-attr(R,left top, cover);
@include bg-attr(X, 50% 30%);
@include bg-attr(N, 30px 20px);
```
compile `css`
```scss
background-repeat: repeat; background-position: left top; background-resize: cover; 
background-repeat: repeat-x; background-position: 50% 30%; 
background-repeat: no-repeat; background-position: 30px 20px;
```


### @placeholder
`scss`
```scss
@include placeholder(){
    color:#b25c9c;
};
// 특정 엘레먼트 적용시 selector를 파라미터로 전달
@include placeholder(#{'input[type=text]'}){
    color:#4773b4;
};
```
compile `css`
```scss
:-ms-input-placeholder { color: #b25c9c; }

::-webkit-input-placeholder { color: #b25c9c; }

::-moz-placeholder { color: #b25c9c; }

:-moz-placeholder { color: #b25c9c; }

// 특정 엘레먼트 적용시 selector를 파라미터로 전달

.placeholder-elements input[type=text]:-ms-input-placeholder { color: #4773b4; }

.placeholder-elements input[type=text]::-webkit-input-placeholder { color: #4773b4; }

.placeholder-elements input[type=text]::-moz-placeholder { color: #4773b4; }

.placeholder-elements input[type=text]:-moz-placeholder { color: #4773b4; }
```


### @line-height
`scss`
```scss
@include line-height(1.3);
@include line-height(20px);
```
compile `css`
```scss
line-height: 1.3; 
line-height: 20px;
```

### @vw-font-pc
Resize with vw for pc *(only fonts)*

`scss`
```scss
@include vw-font-pc('bold', 36px, 26px);
```
compile `css`
```scss
font-family: NobelB-Bold, SDGothicNeoB-Bold; 
font-size: 36px; 
font-size: 1.875vw; 
line-height: 0.722222;
```


### @vw-convert-pc
Resize with vw

`scss`
```scss
@include vw-convert-pc(padding, 30 50 20);
```
compile `css`
```scss
padding: 30px 50px 20px; 
padding: 1.5625vw 2.604167vw 1.041667vw;
```


## @vw-font-tb
Resize with vw for tablet *(only fonts)*

`scss`
```scss
@include vw-font-tb('', 14, 23);
```
compile `css`
```scss
font-size: 14px; 
font-size: 1.09375vw; 
line-height: 1.642857;
```


## @vw-convert-tb
Resize with vw for tablet

`scss`
```scss
@include vw-convert-tb(padding, 30 50 20);
```
compile `css`
```scss
padding: 30px 50px 20px; 
padding: 2.34375vw 3.90625vw 1.5625vw;
```


## @vw-font-mo
Resize with vw for mobile *(only fonts)*

`scss`
```scss
@include vw-font-mo('', 32, 30);
```
compile `css`
```scss
font-size: 4.266667vw; line-height: 0.9375;
```


## @vw-convert-mo
Resize with vw for mobile

`scss`
```scss
@include vw-convert-mo(padding, 30 auto 20);
```
compile `css`
```scss
padding: 4vw auto 2.666667vw;
```


## @vw-font-mo
Resize with vw
- psd size *(browser or devices size)* for converting units to vw 
  - `$psd-pc-width`:     1920px !default;
  - `$psd-tablet-width`: 1280px !default;
  - `$psd-mobile-width`:  750px !default;

`scss`
```scss
@include vw-convert(padding, 20 auto, $psd-pc-width);
@include vw-convert(padding, 20 auto, $psd-tablet-width);
@include vw-convert(padding, 20 auto, $psd-mobile-width);
```
compile `css`
```scss
padding: 20px auto; padding: 1.041667vw auto;
padding: 20px auto; padding: 1.5625vw auto;
padding: 20px auto; padding: 2.666667vw auto;
```




## Installation

`npm install`














