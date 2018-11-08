// 主要实现es6 的 promise标准 参考 promise mdn 实现

class MyPromise {
  constructor(executor) {
    this.state = 'pendding'; // fulfilled   rejected
    this.resolveCb = []
    this.rejectCb = []
    this.data = undefined

    if (typeof executor !== 'function') {
      throw new Error('Promise executor is not a function')
    }

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      reject(err)
    }

  }

  resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(this.resolve, this.reject)
    }
    if (this.state === 'pendding') {
      this.state = 'fulfilled'
      this.data = value
      for (let i = 0; i < this.resolveCb.length; i++) {
        this.resolveCb[i](this.data)
      }
    } else {
      throw new Error('the promise state is already in '+this.state)
    }
  }

  reject(reason) {
    if (this.state === 'pendding') {
      this.state = 'rejected'
      this.data = reason

      for (let i = 0; i < this.rejectCb.length; i++) {
        this.rejectCb[i](this.data)
      }
    } else {
      throw new Error('the promise state is already in '+this.state)
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = function (v) {
        return v
      }
    }
    if (typeof onRejected !== 'function') {
      onRejected = function (r) {
        throw r
      }
    }

    switch (this.state) {
      case 'pendding':
        this.resolveCb.push(onFulfilled)
        this.rejectCb.push(onRejected)
        break;
      case 'fulfilled':
        onFulfilled(this.data)
        break;
      case 'rejected':
        onRejected(this.data)
        break;

      default:
      throw new Error('error promise state in then ')
        break;
    }
    return this;
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

}


let testPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(8)
  }, 2000)
})

testPromise.then(res=>{
  console.log('res is',res)
})