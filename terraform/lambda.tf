# cryptario
module "barnetmap" {
  source        = "./modules/apicall"
  function_name = "barnetmap"
  role          = aws_iam_role.barnetmapLambdaRole.arn
}


output "barnetmapFunctionUrl" {
  value = module.barnetmap.url
}