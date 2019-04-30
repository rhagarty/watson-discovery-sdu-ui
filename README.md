# watson-discovery-sdu-ui

* Searches on document in Disco
* Provide Search field with button at top
* Show top X results in content pane, with "passage_score"
* Ignore results from field: "table_of_contents" when doing SDU version

# TODO:

* Add screenshots for SDU process
* Improve UI
* Come up with good questions that show better results
* Add `keyword` extraction for SDU doc

# Steps:

1. Create discovery service
1. Add ecobee manual as collection 1
1. Add ecobee manual as collection 2
1. Apply SDU to collection 2
1. Configure credentials to point to collection 1
1. Run UI with collection 1
1. Configure credentials to point to collection 2
1. Run UI with collection 2

# Create collections in Discovery

![](doc/source/images/disco-collections.png)

# Configure credentials
The credentials for you collection can be found by clicking the dropdown button located at the top right of the panel. Use these values to populate your `.env` file in the next step.

<p align="center">
  <img width="400" src="doc/source/images/get-creds.png">
</p>

```bash
cp env.sample .env
```

Edit the `.env` file with the necessary settings.

#### `env.sample:`

```bash
# Copy this file to .env and replace the credentials with
# your own before starting the app.

# Watson Discovery
DISCOVERY_URL=<add_discovery_url>
DISCOVERY_IAM_APIKEY=<add_discovery_iam_apikey>
DISCOVERY_ENVIRONMENT_ID=<add_discovery_environment_id>
DISCOVERY_COLLECTION_ID=<add_discovery_collection_id>

# Run locally on a non-default port (default is 3000)
# PORT=3000
```

# Run locally

```bash
npm install
npm start
```

Access the UI by pointing your browser at `localhost:3000`.

Sample questions:

* **how do I set a schedule?**
* **how do I set the temperature?**
* **how do I set the time?**

# Sample Output

![](doc/source/images/sample-output.png)
