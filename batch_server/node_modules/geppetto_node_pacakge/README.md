# NODEJS package file

   1. We need to publish our package json file into nexus registry.
   		Command :

   			npm publish --loglevel info  // output = >  geppetto_ionic_ios_pacakge@1.0.0

   2. We have configured the nexus private-repo in the .npmrc file for publishing.


   ie, our actual package.json is bundled into single package in npm proxied (nexus-priavte-repo).

   			going forward we can get all the dependency for our android project will downloaded from nexus repository.

 Steps : 

 	1.adding code in the package.json file

		  "publishConfig": {
		    "registry": "http://51.143.89.6:8081/repository/npm-private/"
		  }

	2.Place .npmrc file inside the project (where the package.json file resides)
	
	3.Then run npm publish --loglevel info

	4.Then you will get the published package.json file 
			geppetto_node_pacakge@1.0.0	  


	For more details please refer  this link:
		http://www.sonatype.org/nexus/2017/02/14/using-nexus-3-as-your-repository-part-2-npm-packages/