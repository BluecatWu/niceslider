"use strict"
;(function ($) {
  /**
   * NiceSlider
   */
  
  //����PC���ƶ����¼�
  var mobileCheck = 'ontouchend' in document,
    ev = {
      click: 'click',
      start: mobileCheck ? 'touchstart' : 'mousedown',
      move: mobileCheck ? 'touchmove' : 'mousemove',
      end: mobileCheck ? 'touchend' : 'mouseup'
    }
  
  //��ȡ�����ǰ׺
  var prefix = (function () {
    var div = document.createElement('div')
    return typeof div.style.webkitTransform !== 'undefined' ? '-webkit-' : (typeof div.style.mozTransform ? '-moz-' : '')
  }())
  
  /**
   * ������
   * @param {Boolean} unlimit �Ƿ�ִ���޷�ѭ��
   * @param {Boolean} ctrlBtn �Ƿ�������ҿ��ư�ť
   * @param {Boolean} indexBtn �Ƿ�������б�ǩ
   * @param {Function} indexFormat indxBtnΪtrue������£����б�ǩ���ݵ�format����������ֵ���������ǩԪ����
   * @param {Number} offset ƫ��ֵ
   * @param {Number} index ��ʼ�����
   * @param {Boolean} autoPlay �Ƿ��Զ�����
   * @param {Number} duration �Զ����ż��ʱ��
   * @param {Boolean} bounce �Ƿ���лص�Ч��
   * @param {Boolean} drag �Ƿ�֧����ק
   * @param {Boolean} indexBind indxBtnΪtrue������£��Ƿ�����б�ǩ��ӻ����¼�
   * @param {Function} onChange ��λ����ִ����ɺ󴥷�
   * @param {Boolean} noAnimate �رն���
   */
  var defaultConfig = {
    unlimit: true,
    ctrlBtn: true,
    indexBtn: true,
    /*indexFormat: function (i) {
      return '��' + i + '��'
    },*/
    offset: 0,
    index: 0,
    autoPlay: false,
    duration: 5000,
    bounce: true,
    drag: true,
    indexBind: true,
    noAnimate: false
  }
  
  /**
   * ����������
   * @type {Function} 
   * @param {Object} cfg
   * @return {Object}
   */
  function _handleCfg (cfg) {
    return $.extend({}, defaultConfig, cfg)
  }
  
  /**
   * ����Ԫ��λ��
   * @type {Function} 
   * @param {Object} jDom jQuery/Zepto����
   * @param {Number} left λ��ֵ
   */
  function _setLeft (jDom, left) {
    //jDom.css({left: left})
    jDom.css(prefix + 'transform', 'translate3d(' + left + 'px, 0, 0)')        
  }
  
  /**
   * ʱ����Ť������
   * @param {Number} t current time����ǰʱ�䣩
   * @param {Number} b beginning value����ʼֵ����0����b=0��
   * @param {Number} c change in value���仯������1����c=1��
   * @param {Number} d duration������ʱ�䣩 ��1����d=1��
   * @return {Number}
   */
  function _easeOutBack (t, b, c, d) {
    var s = 1.70158
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    //return t / d * c + b
  }
  
  /**
   * ��������
   * @param {Object} args
   */
  function _animate (args) {
    var start = args.start || 0,
      end = args.end || 0,
      jDom = args.dom,
      time = args.time,
      distence = end - start,
      current = start,
      //speed = distence / (time || 300),
      smoothNumber = 10,
      //unitDistence = speed * smoothNumber,
      pastTime = 0,
      that = this
    if (this._aniTimer) {clearInterval(this._aniTimer)}
    //_animating��ʱû������
    this._animating = true
    this._aniTimer = setInterval(function () {
      current = _easeOutBack(pastTime, start, distence, time)
      _setLeft(jDom, current)
      
      //����һ�������ǰ��λ��ֵ���������Ʋ���ʱʹ��
      _moveingLeft = current
      
      pastTime += smoothNumber
      if (pastTime >= time) {
        clearInterval(that._aniTimer)
        that._animating = false
        _setLeft(jDom, end)
        args.cb && args.cb.apply(that)
        that.cfg.onChange && that.cfg.onChange.apply(that)
      }
    }, smoothNumber)
  }
  
  /**
   * ȡ����������
   * @type {Function}
   */
  function _cancelAnimate () {
    if (this._aniTimer) {clearInterval(this._aniTimer); this._animating = false}
  }
  
  /**
   * ����Ԫ��λ�ƶ���
   * @type {Function} 
   * @param {Object} jDom jQuery/Zepto����
   * @param {Number} left λ��ֵ
   */
  function _setAnimate (start, end) {
    //jDom.animate(data, 300, 'swing', function () {})
    if (!this.cfg.noAnimate) {
      _animate.call(this, {
        dom: this.jBox,
        start: start,
        end: end,
        time: 200,
        cb: _resetIndex
      })
    } else {
      _animate.call(this, {
        dom: this.jBox,
        start: end,
        end: end,
        time: 0,
        cb: _resetIndex
      })
    }
  }
  
  /**
   * Ϊǰ�����Ԫ�ذ��¼�
   * @type {Function} 
   * @param {Object} prevBtn 
   * @param {Object} nextBtn 
   */
  function _bindCtrlBtn (prevBtn, nextBtn) {
    var that = this
    prevBtn.on(ev.click, function () {
      that.prev()
    })
    nextBtn.on(ev.click, function () {
      that.next()
    })
    this.jPrevBtn = prevBtn
    this.jNextBtn = nextBtn
  }
  
  /**
   * ������������
   * @type {Function} 
   */
  function _createSteps () {
    var i = 0,
      items = this.jItems,
      l = items.length,
      html = '<ol class="slider-steps">',
      indexFormat = this.cfg.indexFormat,
      that = this,
      steps = null
    for (i; i < l; i++) {
      html += '<li class="step">' + (indexFormat ? indexFormat.call(that, i) : i) + '</li>'
    }
    html += '</ol>'
    this.jWrapper.append(html)
    if (this.cfg.indexBind) {
      steps = this.jWrapper.find('.slider-steps').on(ev.click, '.step', function () {
        var index = steps.find('.step').index($(this))
        that.moveTo(index)
      })
    } else {
      steps = this.jWrapper.find('.slider-steps')
    }
    this.jSteps = steps
  }
  
  /**
   * �������DOM�ṹ
   * @type {Function} 
   */
  function _create () {
    var html = '<div class="slider-wrapper"><div class="slider-content"></div></div>',
      cfg = this.cfg,
      box = this.jBox,
      items = null,
      wrapper = null,
      content = null,
      width = 0,
      multiple = 1
    
    //����refresh���
    if (this.jWrapper) {
      var div = $('<div></div>')
      div.append(box)
      this.jWrapper.after(box)
      this.jWrapper.remove()
      delete this.jWrapper
    }
    
    box.wrap(html)
    this.jWrapper = wrapper = box.parents('.slider-wrapper')
    this.jItems = items = box.children()
    this.jContent = content = wrapper.find('.slider-content')
    if (cfg.ctrlBtn) {
      wrapper.append('<div class="slider-control"><span class="prev"><span class="prev-s"></span></span><span class="next"><span class="next-s"></span></span></div>')
      _bindCtrlBtn.call(this, wrapper.find('.prev'), wrapper.find('.next'))
      this.jCtrl = this.jWrapper.find('.slider-control')
    }
    if (items.length > 1) {
      if (cfg.indexBtn) {
        _createSteps.apply(this)
      }
      if (cfg.unlimit) {
        box.append(items.clone())
        multiple = 2
        if (items.length === 2) {
          box.append(items.clone())
          multiple = 3
        }
      
        //���»�ȡslider item
        this.jItems = items = box.children()
      }
      this.multiple = multiple
      this.realLength = items.length / multiple
      //Zepto����û��outWidth����������ʹ��width
      this.itemWidth = width = items.width()
      this.jItems.width(width)
      box.width(width * items.length)
      this.boxWidth = parseInt(box.width() / multiple, 10)
      //_setLeft(box, -1 * this.boxWidth + cfg.offset)
      content.height(box.height())
      //���û�����Χ�����ڷ��޷�ѭ����ʹ��
      this.rangeWidth = this.boxWidth - this.jWrapper.width() + cfg.offset
      this.currentLeft = cfg.index * this.itemWidth
      this.moveTo(cfg.index)
    } else {
      this.multiple = 1
      this.itemWidth = width = items.width()
      this.realLength = 1
      box.width(width)
      content.height(box.height())
      this.boxWidth = width
      this.rangeWidth = 0
      wrapper.addClass('slider-no-effect')
      this.currentLeft = 0
      this.moveTo(0)
    }
    
  }
  
  ////////////////////////darg���
  var _origin = {},
    _currentPoint = {},
    _locked = false,
    _isChecked = false,
    _dir = true,
    _distance = 0,
    _currentSlider = null,
    _bound = false,
    _sliderCount = 0,
    _moveingLeft = 0
  
  /**
   * ��ȡ�¼������е�����ֵ
   * @type {Function} 
   * @param {Object} e
   * @return {Object} ��������ֵ�Ķ���
   */
  var _getXY = function (e) {
    var e = e.originalEvent ? e.originalEvent : e,
      touches = e.touches,
      x = 0,
      y = 0
    if (touches) {
      x = touches[0].pageX
      y = touches[0].pageY
    } else {
      x = e.clientX
      y = e.clientY
    }
    
    return {x: x, y: y} 
  }
  
  /**
   * ������
   * @type {Function} 
   * @param {Object} e
   */
  function _touchstart (e) {
    _cancelAnimate.apply(this)
    this.touched = true
    _origin = _getXY(e)
    _locked = false
    _isChecked = false
    _dir = 0
    _distance = 0
    _currentSlider = this
    if (this.timer) {clearTimeout(this.timer)}
  }
  
  /**
   * ������
   * @type {Function} 
   * @param {Object} e
   */
  function _touchmove (e) {
    if (_currentSlider && _currentSlider.cfg.drag) {
      if (_currentSlider.touched) {
        _currentPoint = _getXY(e)
        _handleMove.call(_currentSlider, _currentPoint.x - _origin.x)
        if (_locked) {e.preventDefault()}
      }
    }
  }
  
  /**
   * �����ͷ�
   * @type {Function} 
   * @param {Object} e
   */
  function _touchend (e) {
    if (_currentSlider) {
      if (_currentSlider.cfg.drag) {
        _origin = {}
        _currentPoint = {}
        if (_locked) {_checkIndex.apply(_currentSlider)}
        _currentSlider.touched = false
        _locked = false
      }
      //_setAutoPlay.apply(_currentSlider)
      _currentSlider = null
    }
    
    _moveingLeft = 0
  }
  
  /**
   * �������
   * @type {Function} 
   * @param {Object} e
   */
  function _handleScroll (e) {
    if (_currentSlider) {
      _currentSlider.touched = false
      _origin = {}
      _currentPoint = {}
      _locked = false
    }
  }
  
  /**
   * �ж�����/���һ���
   * @type {Function} 
   * @param {Number} deltaX
   * @param {Number} deltaY
   */
  function _checkDir (deltaX, deltaY) {
    if (!_isChecked) {
      _isChecked = true
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        _locked = false
        this.touched = false
      } else {
        _locked = true
      }
    }
  }
  
  /**
   * ��������ƶ�
   * @type {Function} 
   * @param {Number} deltaX
   */
  function _handleMove (deltaX) {
    if (!_isChecked) {
      _checkDir.call(this, _currentPoint.x - _origin.x, _currentPoint.y - _origin.y)
    }
    //����slider��������
    _dir = deltaX > 0
    _distance = deltaX
    _move.call(this, deltaX)
  }
  
  ///////////////drag���
  
  /**
   * slider��Ե�ǰλ�����ƶ�
   * @type {Function} 
   * @param {Number} x λ�ƾ���
   */
  function _move (x) {
    var x = this.currentLeft + x
    if (!this.cfg.bounce && !this.cfg.unlimit) {
      x = Math.min(0, Math.max(x, -1 * this.rangeWidth))
    }
    _setLeft(this.jBox, x)
    _moveingLeft = x
  }
  
  /**
   * ��slider���ƶ�ֵ�����ȷ����ǰindex
   * @type {Function} 
   */
  function _checkIndex () {
    var idx = this.currentIndex,
      w = this.itemWidth,
      l = this.jItems.length,
      rl = this.realLength,
      d = Math.abs(_distance),
      deltaIndex = 0
    //δ���������¼� _dir��0 ����booleanֵ
    if (_dir === 0) {return}
            
    if (this.cfg.unlimit) {
      //idx = idx + (_dir ? -1 : 1)
      //this.moveTo(idx)
      _dir ? this.prev() : this.next()
    } else {
      //���ݻ��������жϻ����˶��ٸ�item
      if (d > w / 2) {
        deltaIndex = (_dir ? -1 : 1) * Math.ceil(d / w)
      }
      idx = idx + deltaIndex
      idx = Math.max(0, Math.min(idx, this.realLength - 1))
      this.moveTo(idx)
    }
  }
  
  /**
   * ��slider�Ŀ��ư�ť�����
   * @type {Function} 
   */
  function _checkCtrlBtn () {
    var idx = this.currentIndex,
      cfg = this.cfg,
      l = this.realLength,
      pb = this.jPrevBtn,
      nb = this.jNextBtn
    
    if (!cfg.unlimit) { 
      //�����ư�ť״̬
      if (idx === 0) {
        pb.addClass('disable')
      } else {
        pb.removeClass('disable')
      }
      if (idx === l - 1) {
        nb.addClass('disable')
      } else {
        nb.removeClass('disable')
      }
    } else {
      if (l === 1) {
        pb.addClass('disable')
        nb.addClass('disable')
      }
    }
  }
  
  /**
   * ������ǰindex
   * @type {Function} 
   */
  function _toggleStepTo () {
    var idx = this.currentIndex,
      cfg = this.cfg,
      l = this.realLength,
      pb = this.jPrevBtn,
      nb = this.jNextBtn
     
    this.jSteps.find('.step').removeClass('current').eq(idx % l).addClass('current')
  }
  
  /**
   * ִ���Զ�����
   * @type {Function} 
   */
  function _setAutoPlay () {
    var that = this,
      cfg = this.cfg
    if (cfg.autoPlay) {
      if (this.timer) {clearTimeout(this.timer)}
      this.timer = setTimeout(function () {
        //that.next()
        
        var idx = that.currentIndex + 1
        if (that.cfg.unlimit) {
          that.moveTo(idx)
        } else {
          idx = idx % that.realLength
          that.moveTo(idx)
        }
        
        _setAutoPlay.apply(that)
      }, this.cfg.duration)
    }
  }
  
  /**
   * �޷�ѭ��ʱ���������������ú����index
   * @type {Function} 
   */
  function _resetIndex () {
    var idx, rl, l
    if (this.cfg.unlimit && !this.touched) {
      idx = this.currentIndex
      rl = this.realLength
      l = this.jItems.length
      if (rl > 1) {
        if (idx <= 1) {
          idx = rl + 1
          this.setIndexTo(idx)
        } else if (idx >= l - 2) {
          idx = l - 2 - rl
          this.setIndexTo(idx)
        }
      }
    }
  }
  
  /**
   * slider��λ����Ӧindex��������Ч��
   * @type {Function} 
   * @param {Number} idx
   */
  function _moveTo (idx) {
    var l = this.jItems.length,
      w = this.itemWidth,
      offset = this.cfg.offset,
      multiple = this.multiple,
      rl = this.realLength,
      left = 0,
      that = this
      
    if (this.cfg.unlimit) {
      if (rl > 1) {
        if (idx <= 0) {
          idx = rl
          this.setIndexTo(idx + 1)
        } else if (idx >= l - 1) {
          idx = l - 1 - rl
          this.setIndexTo(idx - 1)
        }
        left = -1 * idx * w + offset
      } else {
        idx = 0
        left = offset
      }
    } else {
      idx = idx % l
      left = Math.max(-1 * idx * w + offset, -1 * this.rangeWidth)
    }
    
    //setTimeout(function () {_setLeft(that.jBox, left)}, 0)
    
    _setAnimate.call(this, this.touched ? _moveingLeft : this.currentLeft, left)
    this.currentIndex = idx
    this.currentLeft = left
    
    if (this.jSteps) {_toggleStepTo.apply(this)}
    if (this.cfg.ctrlBtn) {_checkCtrlBtn.apply(this)}
    _setAutoPlay.apply(this)
  }
  
  /**
   * slider������ʾΪ��Ӧindex��
   * @type {Function} 
   * @param {Number} idx
   */
  function _setIndexTo (idx) {
    var wrapper = this.jWrapper,
      l = this.jItems.length,
      w = this.itemWidth,
      offset = this.cfg.offset,
      left = 0
    if (idx.toString() === 'NaN') {return}
    idx = parseInt(idx, 10) % l
    left = -1 * idx * w + offset
    _setLeft(this.jBox, left)
    this.currentIndex = idx
    this.currentLeft = left
  }
  
  /**
   * slider��ǰ����һ��
   * @type {Function} 
   */
  function _prev () {
    var idx = this.currentIndex - 1
    if (this.cfg.unlimit) {
      this.moveTo(idx)
    } else {
      if (idx < 0) {return}
      this.moveTo(idx)
    }
  }
  
  /**
   * slider���󻬶�һ��
   * @type {Function} 
   */
  function _next () {
    var idx = this.currentIndex + 1
    if (this.cfg.unlimit) {
      this.moveTo(idx)
    } else {
      if (idx >= this.realLength) {return}
      this.moveTo(idx)
    }
  }
  
  /**
   * ˢ��slider
   * @type {Function} 
   * @param {Object}
   */
  function _refresh (cfg) {
    
    if (this.cfg.unlimit === true) {
      _resetItems.apply(this)
    }
    
    var cfg = this.cfg = _handleCfg(cfg || {})
    if (this.timer) {clearTimeout(this.timer)}
    _init.apply(this)
  }
  
  /**
   * ����slider��
   * @type {Function} 
   */
  function _resetItems () {
    var l = this.realLength - 1
    this.jItems.each(function (i, o) {
      if (i > l) {$(o).remove()}
    })
  }
  
  /**
   * ����ʵ������
   * @type {Function} 
   */
  function _destroy () {
    var item = ''
    this.jWrapper.remove()
    for (item in this) {
      delete this[item]
    }
    
    this.__proto__ = null
    
    _sliderCount--
    if (_sliderCount === 0) {
      _unbind()
    }
  }
  
  /**
   * ����ק����¼�
   * @type {Function} 
   */
  function _bind () {
    var that = this
    this.jContent.on(ev.start, function (e) {_touchstart.call(that, e)})
    //this.jBox.on(ev.move, function (e) {
      //if (_locked) {e.preventDefault()}
    //})
    if (!_bound) {
      $(document).on(ev.move, _touchmove).on(ev.end, _touchend)
      //$(window).on('scroll', _handleScroll)
      _bound = true
    }
  }
  
  /**
   * �Ƴ������¼�
   * @type {Function} 
   */
  function _unbind () {
    $(document).off(ev.move, _touchmove).off(ev.end, _touchend)
    //$(window).off('scroll', _handleScroll)
    _bound = false
  }
  
  /**
   * ��ʼ��
   * @type {Function} 
   */
  function _init () {
    this.currentIndex = this.cfg.index
    _create.apply(this)
    _bind.apply(this)
    _setAutoPlay.apply(this)
    _sliderCount++
  }
  
  /**
   * NiceSlider����
   * @type {Function}
   * @param {Object} dom 
   * @param {Object} cfg ������
   */
  function NiceSlider (dom, cfg) {
    this.jBox = $(dom)
    this.cfg = _handleCfg(cfg || {})
    _init.apply(this)
  }
  
  NiceSlider.prototype = {
    prev: _prev,
    next: _next,
    setIndexTo: _setIndexTo,
    moveTo: _moveTo,
    refresh: _refresh,
    destroy: _destroy
  }
  
  if(typeof define === 'function' && define.amd) {
		define([], function () {
			return NiceSlider
		})
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = NiceSlider
	} else {
		window.NiceSlider = NiceSlider
	}
  
}(window.jQuery || window.Zepto))