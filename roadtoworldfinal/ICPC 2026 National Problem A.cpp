#include<bits/stdc++.h>
using namespace std ; 
#define int long long
#define ll long long 
#define pb push_back 
#define fi first 
#define se second 
#define left id<<1
#define right id<<1|1 
#define re exit(0); 
#define _lower(x) lower_bound(v.begin(),v.end(),x)-v.begin()+1 
#define mid (l+r)/2
#define all(x) x.begin(),x.end()
#define TIME (1.0*clock() / CLOCKS_PER_SEC)
const int mod = 1e9+7;
const int INF = 1e9+2; 

typedef vector<int> vi; 
typedef pair<int,int> pii; 
typedef vector<pii> vii; 

template <typename T> void chkmin (T &a , T b) {if (a > b) a = b;} 
template <typename T> void chkmax (T &a , T b) {if (a < b) a = b;} 

void add (int &a , int b) 
{
    a += b; 
    if (a >= mod) a -= mod; 
    if (a < 0) a += mod; 
}


int _pow(int a, int n) 
{
    if (n == 0) return 1; 
    int res = _pow(a,n/2); 
    if (n % 2) return 1ll*res*res%mod*a%mod; 
    else return 1ll*res*res%mod; 
}
#define maxn 500009

int n,m; 
string A,B; 
int f[maxn],fa[maxn],fb[maxn],sum_fa[maxn],sum_fb[maxn]; 
int t[maxn]; 
// f[0] = 1, f[i] = sum (f[j]) with A[j] != 0, a[i] == 0, f[i] = f[i-1],  a[i] != b[i] -> f[i] = 0
// fa[n+1] = 1, if A[i] = 0, fa[i] = fa[i+1], else fa[i] = sum_fa[i+1]
// same for fb
// t is case the way len A < len B. t[i] = t[i+1] + fa[i+1]*sum_fb[i+2]; 
void compute() 
{
    for (int i = 0; i <= min(n,m) + 2; i ++) f[i] = t[i] = 0; 
    for (int i = 0; i <= n+2; i ++) fa[i] = sum_fa[i] = 0; 
    for (int i = 0; i <= m+2; i ++) fb[i] = sum_fb[i] = 0; 
    //reset 
    f[0] = 1; 
    int sum = 0; 
    for (int i = 1; i <= min(n,m); i ++) 
    {
        if (A[i] != B[i]) break; 
        f[i] = f[i-1]; 
        add(f[i],sum); 
        if (A[i] != '0') add(sum,f[i-1]);
    }
    sum_fa[n+1] = fa[n+1] = 1; 
    for (int i = n; i >= 1; i --) 
    {
        if (A[i] == '0') fa[i] = fa[i+1]; 
        else fa[i] = sum_fa[i+1]; 
        sum_fa[i] = sum_fa[i+1]; add(sum_fa[i],fa[i]); 
    }
    sum_fb[m+1] = fb[m+1] = 1; 
    for (int i = m; i >= 1; i --) 
    {
        if (B[i] == '0') fb[i] = fb[i+1]; 
        else fb[i] = sum_fb[i+1]; 
        sum_fb[i] = sum_fb[i+1]; add(sum_fb[i],fb[i]); 
    }
    
    t[min(n,m)+1] = 0; 
    for (int i = min(n,m); i >= 1; i --) 
    {
        int way = fa[i+1]*sum_fb[i+2]%mod; 
        t[i] = t[i+1]; add(t[i],way); 
    }
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    int test; cin >> test; 
    while (test--) 
    {
        cin >> A >> B; 
        n = A.size(), m = B.size(); 
        A = ' ' + A, B = ' ' + B; 

        compute(); 
        int diff = min(n,m) + 1; 
        for (int i = 1; i <= min(n,m); i ++) if (A[i] != B[i]) { diff = i; break;}
        
        int way_diff = 0; 
        for (int i = diff; i <= min(n,m); i ++) add(way_diff,fa[i+1]*fb[i+1]%mod); 
        
        int answer = 0; 
        for (int i = 1; i <= min({n,m,diff}); i ++) 
        {
            if(diff != min(n,m)+1 && A[diff] < B[diff] && A[i] != '0' && B[i] != '0') add(answer,f[i-1]*way_diff%mod); // case same length and a[diff] < b[diff]
            if (A[i] != '0' && B[i] != '0') add(answer,f[i-1]*t[i]%mod); // case length A < length B 
            if (A[i] == '0' && B[i] > '0') add(answer,f[i-1]*fa[i+1]%mod*sum_fb[i+1]%mod); // case A[i] = 0, must be fa[i+1] and b can be everywhere 
        }
        if (n < m && diff == n+1) add(answer,f[n]*fb[n+1]%mod); // case for n is prefix of m, compare about number component 

        cout << answer << "\n"; 
    }
    return 0;
}
