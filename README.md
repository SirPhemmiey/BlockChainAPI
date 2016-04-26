

# BlockChainAPI

Block chain APIs - Node.JS

## Usage

API calls:

	post('/createTransaction') payload = {"data": "", "host" : ""}
	post('/getTransactionHashData/:mutation_hash') payload = {"host" : ""}
	post('/validateTransactionData/:mutation_hash') payload = {"audit_data" : "", "host" : ""}
	post('/getMutationHashList') payload = {"host" : ""}
	
## Dependencies 

    "express": "3.2.6",
    "ejs": "*",
    "bitcore-lib": "0.13.14",
    "httpinvoke": "1.4.0",
    "node-rest-client": "1.8.0",
    "openchain": "0.2.2"

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
