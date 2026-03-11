# barnetmap

module "barnetgeojson" {
  source        = "./modules/apicall"
  function_name = "barnetgeojson"
  role          = aws_iam_role.barnetmapLambdaRole.arn
}


output "barnetgeojsonFunctionUrl" {
  value = module.barnetgeojson.url
}