# NiceSlider
�������ƶ��˻������

Ŀǰ�������һЩ���Ƽ�ȱ�ݣ�

- ֻ֧�����һ�����
- PC�ִ�������н�֧��FF��chrome, IE 9+δ���ԣ�
- ��һ����������¶������£�����ֵ��ʾ�������⡣

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

������ | ���� | Ĭ��ֵ | ˵��
---- | ---- | ---- | ----
unlimit | Boolean | true | �Ƿ�ʵ���޷�ѭ��
ctrlBtn | Boolean | true | �Ƿ�������ҿ��ư�ť
indexBtn | Boolean | true | �Ƿ��������Ԫ��
indexFormat | Function | - | �Զ�������Ԫ������
offset | Number | 0 | ƫ��ֵ
index | Number | 0 | ��ʼ��ʾ���
autoPlay | Boolean | false | �Զ�����
duration | Number | 5000 | �Զ����ż��ʱ��
bounce | Boolean | true | ���޷�ѭ��ʱ���Ƿ�֧�ֱ߽�ص�Ч��
drag | Boolean | true | ֧��������ק����
indexBind | Boolean | true | ����Ԫ�ص��������λ
noAnimate | Boolean | false | �رն���

## ����

������ | ���� | ˵��
---- | ---- | ----
prev | - | ����ǰһ��
next | - | �����һ��
setIndexTo | Number | ������λ��ĳ��
moveTo | Number | ������ĳ��
refresh | Object | ˢ����������������趨������
destroy | - | �������

---------------

### [�鿴DEMO](http://ajccom.sinaapp.com/demo/niceslider.html)


