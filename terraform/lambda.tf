# barnetmap

module "barnetgeojson" {
  source        = "./modules/apicall"
  function_name = "barnetgeojson"
  role          = aws_iam_role.barnetmapLambdaRole.arn
}


output "barnetgeojsonFunctionUrl" {
  value = module.barnetgeojson.url
}

module "barnetmem" {
  source        = "./modules/apicall"
  function_name = "barnetmem"
  role          = aws_iam_role.barnetmapLambdaRole.arn
}


output "barnetmemFunctionUrl" {
  value = module.barnetmem.url
}