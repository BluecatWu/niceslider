# NiceSlider
�������ƶ���Slide�������

ĿǰNiceSlider�����Ƽ�ȱ�ݣ�

- ����jQuery/Zepto��

ĿǰNiceSlider�߱���������

- �Դ����ư�ť������ֵ��
- �Զ�������ֵ��
- ֧�ֶ�sliderǶ�ף�
- ˫�򻬶�������
- ���򻬶�������
- �Զ���ƫ��ֵ��
- ֧���޷�ѭ����
- ֧������ˢ�£�
- �Զ��嶯����
- ֧�ֻص���
- �Զ����ţ�
- ������ק��
- ��ʽ���ã�
- carousel��黬����

ʹ��NiceSlider�����ƣ�

- ���С��ѹ����(����gzip)�ļ���Сֻ��3K���ң�
- ���÷ḻ������������slide����
- ����֧���������ƶ��ˡ�

## �÷�

����һ����Ԫ�أ�����Ҫ������ʾ�����ݷ��븸Ԫ���У����磺

```
<ul id="slider1">
  <li>item 1 </li>
  <li>item 2 </li>
  <li>item 3 </li>
</ul>
```

Ȼ����ڸ�Ԫ�ش������:

```
var slider = new NiceSlider('#slider1')
```

-------------------------------------

## ����

`new NiceSlider('#slider1', config)`

������ | ���� | Ĭ��ֵ | ˵��
---- | ---- | ---- | ----
unlimit | Boolean | true | �Ƿ�ʵ���޷�ѭ��
ctrlBtn | Boolean | true | �Ƿ�������ҿ��ư�ť
indexBtn | Boolean | true | �Ƿ��������Ԫ��
indexFormat | Function | - | �Զ�������Ԫ������
unit | Number | 1 | ���õ��λ��������������0�򻬶�һ��Ļ
offset | Number | 0 | ƫ��ֵ
index | Number | 0 | ��ʼ��ʾ���
dir | String | 'h' | ��������
autoPlay | Boolean | false | �Զ�����
duration | Number | 5000 | �Զ����ż��ʱ��
bounce | Boolean | true | ���޷�ѭ��ʱ���Ƿ�֧�ֱ߽�ص�Ч��
drag | Boolean | true | ֧��������ק����
indexBind | Boolean | true | ����Ԫ�ص��������λ
noAnimate | Boolean | false | �رն���
animation | String | ease-out-back | ָ������Ч������ѡ����`ease-out-back`��`linear`
extendAnimate | Object | - | ������չ����Ч������������`swing`��`ease-in`��

## ����

������ | ���� | ˵��
---- | ---- | ----
prev | - | ����ǰһ��
next | - | �����һ��
setIndexTo | index | ������λ��ĳ����Ƽ�ʹ�ã�������moveTo���
moveTo | index, duration | ������ĳ��, �ڶ�������������������ʱ��
getIndex | - | ��ȡ�����ǰ������ֵ
checkLock | - | ��ȡ���˫������״̬
lock | - | ���������������������޷�˫�򻬶�
unlock | - | �������
checkLockPrev | - | ��ȡ�����ǰ����״̬
lockPrev | - | ����������޷���ǰ����
unlockPrev | - | �������
checkLockNext | - | ��ȡ�����������״̬
lockNext | - | ����������޷����󻬶�
unlockNext | - | �������
refresh | config | ˢ����������������趨������
destroy | - | �������

## ����

������ | ���� | ˵��
---- | ---- | ----
fragmentDom | Object | ���ԭ��DOMƬ�Σ�`refresh`��������ʹ�������ˢ�´���
current | Number | �������Ŀǰ��CSSλ��ֵ
cfg | Object | �����ǰ����
currentIndex | Number | ��ǰ����ֵ���޷�ѭ�����Ƽ�ʹ��`getIndex`����

---------------

### [�鿴DEMO](http://ajccom.github.io/niceslider/)

---------------

### [Change log](https://github.com/ajccom/niceslider/blob/master/release/changelog.md)



