# local-rcv-votes

# Mapping RCV Ballot Measures

This map shows local ballot measures pertaining to electoral systems in municipalities across the United States from 2018 through 2022, specifically ballot measures with a yes-no vote on ranked choice voting (RCV) or similar electoral systems.

## UX
I'd like to share this map with my local Rank the Vote chapter, and publish it as a resource for other organizations working to pass RCV locally. 

## Making a Useful Map
 Because these yes-no votes create a binary (for or against ranked choice voting), we can visualize outcomes of local measures, and pin them geographically to their cities or counties. 

 - Minicharts pie charts show pro-RCV versus anti-RCV votes in each locality. 
 - To show a complete picture of RCV use in municipalities, circular markers show jurisdictions that use RCV but did not establish the practice through direct voter reform between 2018 and 2022.
 - A side panel provides more (perhaps way too much more) information on RCV and other alternative voting practices.


## Data Sources
Election outcomes are compiled from[localities tracked by Ballotpedia](https://ballotpedia.org/Ranked-choice_voting_%28RCV%29). This may be an incomplete list--small localities tend to be excluded from national tracking projects. Outcomes of each election are furnished by county board of elections processes.

## Technology

 - HTML, CSS, JS
 - Leaflet
 - Basemap created in Mapbox Studio
 - Parsing provided through Omnivore
 - Pie charts created with Minicharts
 - Hosting provided through Github Pages
