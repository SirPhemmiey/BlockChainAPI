// create transaction to store data in blockchain
// payload = {"data": "", "host" : ""}
exports.createTransaction = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	console.log("going to store data in block chain");
	var host = input.host;

	var express = require("express");
	var openchain = require("openchain");
	var client = new openchain.ApiClient(host + "/");
	var httpinvoke = require("httpinvoke");
	var bitcore = require("bitcore-lib");

	client.httpGet = function(url) {
		return httpinvoke(url, "GET", {
			headers : {
				'Connection' : 'keep-alive'
			}
		}).then(function(data) {
			return JSON.parse(data.body);
		});
	};

	client.httpPost = function(url, body) {
		return httpinvoke(url, "POST", {
			headers : {
				'Connection' : 'keep-alive'
			},
			input : body
		}).then(function(data) {
			return JSON.parse(data.body);
		});
	};

	var seed = "0123456789abcdef0123456789abcdef";
	// var seed = "blockflow";

	// Load a private key from a seed
	var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
	var address = privateKey.publicKey.toAddress();

	// Calculate the accounts corresponding to the private key
	var dataPath = "/asset/p2pkh/" + address + "/WorkFlowData/";
	var recordName = "datarecord";
	var storedData = input.data;

	console.log("Account path: " + dataPath);
	console.log("Record name: " + recordName);

	var signer = new openchain.MutationSigner(privateKey);

	// Initialize the client
	client.initialize().then(function() {
		// Retrieve the record being modified
		return client.getDataRecord(dataPath, recordName)
	}).then(function(dataRecord) {
		// Encode the data into a ByteBuffer
		var newValue = openchain.encoding.encodeString(storedData);

		// Create a new transaction builder
		return new openchain.TransactionBuilder(client)
		// Add the key to the transaction builder
		.addSigningKey(signer)
		// Modify the record
		.addRecord(dataRecord.key, newValue, dataRecord.version)
		// Submit the transaction
		.submit();
	}).then(function(result) {
		console.log(result);
		res.send(result);
	});
};

// get transaction hash data from blockchain based on input mutation hash
// payload = {"host" : ""}
exports.getTransactionHashData = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	var host = input.host;

	var mutation_hash = req.params.mutation_hash;
	var url = host + '/query/transaction?mutation_hash=' + mutation_hash
			+ '&format=json';
	var Client = require('node-rest-client').Client;

	var client = new Client();

	// registering remote methods
	client.registerMethod("jsonMethod", url, "GET");
	client.methods.jsonMethod(function(data, response) {
		// parsed response body as js object
		console.log("Transaction data hash for mutation: " + mutation_hash
				+ "is" + data.mutation.records[0].value);
		// raw response
		var json_res = {
			"mutation_hash" : mutation_hash,
			"transaction_data" : data.mutation.records[0].value
		};
		res.send(json_res);
	});
};

// validate transaction data based on mutation hash and input data
// payload = {"audit_data" : "", "host" : ""}
exports.validateTransactionData = function(req, res) {

	// getting audit data from json payload.
	var input = JSON.parse(JSON.stringify(req.body));
	var audit_data = input.audit_data;
	var host = input.host;

	console.log(audit_data);

	// getting mutation_hash from request parameter.
	var audit_mutation_hash = req.params.mutation_hash;

	// creating response json object with status attribute.
	var json_res = {
		"status" : ""
	};

	var blockchain_hash_data;
	var audit_hash_data;

	// getting hash value from input audit mutation hash
	console.log("going to get hash value for input audit mutation hash")
	try {
		// blockchain_hash_data = getData(audit_mutation_hash);

		var url = host + '/query/transaction?mutation_hash='
				+ audit_mutation_hash + '&format=json';

		console.log("going to get hash_value for: " + url);

		var Client = require('node-rest-client').Client;

		var client = new Client();

		// registering remote methods
		client.registerMethod("jsonMethod", url, "GET");
		client.methods
				.jsonMethod(function(data, response) {
					// parsed response body as js object

					console.log(data.mutation.records[0].value);
					blockchain_hash_data = data.mutation.records[0].value;
					// return data.mutation.records[0].value;

					// ========================================1

					console
							.log("--------------------> storing transaction for : "
									+ audit_data);

					var express = require("express");
					var openchain = require("openchain");
					var client = new openchain.ApiClient(host + "/");
					var httpinvoke = require("httpinvoke");
					var bitcore = require("bitcore-lib");

					client.httpGet = function(url) {
						return httpinvoke(url, "GET", {
							headers : {
								'Connection' : 'keep-alive'
							}
						}).then(function(data) {
							return JSON.parse(data.body);
						});
					};

					client.httpPost = function(url, body) {
						return httpinvoke(url, "POST", {
							headers : {
								'Connection' : 'keep-alive'
							},
							input : body
						}).then(function(data) {
							return JSON.parse(data.body);
						});
					};

					var seed = "0123456789abcdef0123456789abcdef";

					// Load a private key from a seed
					var privateKey = bitcore.HDPrivateKey.fromSeed(seed,
							"openchain");
					var address = privateKey.publicKey.toAddress();

					// Calculate the accounts corresponding to the private key
					var dataPath = "/asset/p2pkh/" + address + "/AuditData/";
					var recordName = "datarecord";
					var storedData = audit_data;

					console.log("Account path: " + dataPath);
					console.log("Record name: " + recordName);

					var signer = new openchain.MutationSigner(privateKey);

					// Initialize the client
					client
							.initialize()
							.then(
									function() {
										// Retrieve the record being modified
										return client.getDataRecord(dataPath,
												recordName)
									})
							.then(
									function(dataRecord) {
										// Encode the data into a ByteBuffer
										var newValue = openchain.encoding
												.encodeString(storedData);

										// Create a new transaction builder
										return new openchain.TransactionBuilder(
												client)
										// Add the key to the transaction
										// builder
										.addSigningKey(signer)
										// Modify the record
										.addRecord(dataRecord.key, newValue,
												dataRecord.version)
										// Submit the transaction
										.submit();
									})
							.then(
									function(result) {
										console.log(result.mutation_hash);
										// res.send(result);
										var temp_audit_mutation_hash = result.mutation_hash;

										console.log("audit_hash_data is: "
												+ temp_audit_mutation_hash);

										console
												.log("--------------------> going to get audit_hash_data from mutation hash : "
														+ temp_audit_mutation_hash);

										// ========================================2

										var url = host
												+ '/query/transaction?mutation_hash='
												+ temp_audit_mutation_hash
												+ '&format=json';

										console
												.log("going to get hash_value for: "
														+ url);

										var Client = require('node-rest-client').Client;

										var client = new Client();

										// registering remote methods
										client.registerMethod("jsonMethod",
												url, "GET");
										client.methods
												.jsonMethod(function(data,
														response) {
													// parsed response body as
													// js object

													console
															.log(data.mutation.records[0].value);
													audit_hash_data = data.mutation.records[0].value;

													// ========================================3

													console
															.log("going to compare audit_hash_data: "
																	+ audit_hash_data
																	+ " and blockchain_hash_data: "
																	+ blockchain_hash_data);
													console.log()
													if (audit_hash_data === blockchain_hash_data) {
														json_res = {
															"status" : "true"
														}
														res.send(json_res);
													} else {
														json_res = {
															"status" : "false"
														}
														res.send(json_res);
													}

													// ========================================3

												});

										// ========================================2

									});

					// ========================================1

				});

	} catch (err) {
		console.log(err.message);
		json_res = {
			"status" : "Not able to verify data for input mutation_hash: "
					+ audit_mutation_hash
		};
		res.send(json_res);
	}
}

// get all mutation hash list which are related to input transaction record key
// payload = {"host" : ""}
exports.getMuationHashList = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
	var host = input.host;
	var data = getMutationList(host, function(data) {
		console.log("got mutation data list list!");

		var final_json = [];
		for (var i = 0; i < data.length; i++) {

			var mutation_hash = data[i].mutation_hash;

			// going to get detailed data
			getRecordData(host, mutation_hash, function(json_res) {
				console.log(json_res);
				final_json.push(json_res);

				if (data.length === final_json.length) {
					res.send(final_json);
				}

			});
		}
	});

}// end getMutationList callback

function getMutationList(host, callback) {

	record_key = "2f61737365742f7032706b682f586e444d45467631366b367459623247474265746b416d52384254636f714672346d2f576f726b466c6f77446174612f3a444154413a646174617265636f7264";
	var url = host + "/query/recordmutations?key=" + record_key;
	console.log("going to get hash_value for: " + url);
	var Client = require('node-rest-client').Client;
	var client = new Client();

	// registering remote methods
	client.registerMethod("jsonMethod", url, "GET");
	client.methods.jsonMethod(function(data, response) {
		// parsed response body as js object
		if (callback && typeof (callback) === "function") {
			callback(data);
		}
	});

}

function getRecordData(host, mutation_hash, callback) {

	var url = host + '/query/transaction?mutation_hash=' + mutation_hash
			+ '&format=json';
	var Client = require('node-rest-client').Client;

	var client = new Client();

	// registering remote methods
	client.registerMethod("jsonMethod", url, "GET");
	client.methods.jsonMethod(function(data, response) {
		// parsed response body as js object
		var json_res = {
			"mutation_hash" : mutation_hash,
			"transaction_data" : data.mutation.records[0]
		};

		// console.log(json_res);
		if (callback && typeof (callback) === "function") {
			callback(json_res);
		}
	});

}
// var host = "http://54.153.102.235:8080";
