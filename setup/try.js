
let someAsyncFunction = async () => {
	return true
}

let someFunction =  async (callback)=> {
	await someAsyncFunction()
	await callback()
}

// try {
// 	someFunction(()=> {
// 		console.log("Callback has been called")
// 		throw ("Some error")
// 	});

// } catch (error) {
// 	console.log(error)
// }

// someFunction(() => {
//     console.log("Callback has been called")
//     throw new Error("Some error");
// }).catch(error => {
//     console.log(error.message)
// });


someAsyncFunction().then(() => {
    console.log("Callback has been called")
    throw new Error("Some error");
}).catch(error => {
    console.log(error.message)
});




// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////
// let someAsyncFunction = async () => {
//     return true
// }

// // If top level `await` is allowed
// try {
//   await someAsyncFunction()
//   console.log('someAsyncFunction has finished')
//   throw "Some error"
// } catch (error) {
//   console.log(error)
// }

// // If you can't use `await` here, you can just use the built-in Promise
// someAsyncFunction()
//   .then(() => {
//     throw ("Some error")
//     console.log("Callback has been called")
//   })
//   .catch(error => {
//     console.log(error)
//   })




