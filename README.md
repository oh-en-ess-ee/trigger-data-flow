# Trigger Pipeline

A cloud function that is triggered when a file is added to a storage bucket. This is a NodeJS 10 function just to 
invoke a template dataflow pipeline.

## Pre-requisites

1. A bucket with a pipeline template .jar file in it
1. A source bucket that the input file will be added to
1. A target bucket for the processed output